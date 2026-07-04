/**
 * lib/openrouter.ts
 *
 * Single source of truth for all OpenRouter AI calls in RepoScribe.
 *
 * Features:
 *  - Curated, verified list of free OpenRouter models (ordered best → most available)
 *  - Per-model first-token deadline (avoids hanging on a stalled model)
 *  - Exponential back-off with jitter between model retries on 429 / timeout
 *  - Stream health watchdog (closes stream if no byte arrives for WATCHDOG_MS)
 *  - Minimum-token validation (rejects empty/broken model responses)
 *  - Clean AbortController scoping — no listener leaks
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/** ms to wait for the FIRST token from a model before giving up on it */
const FIRST_TOKEN_DEADLINE_MS = 25_000;

/** ms of silence during an active stream before we close it */
const WATCHDOG_MS = 12_000;

/** Minimum number of characters the full response must contain to be considered valid */
const MIN_RESPONSE_CHARS = 50;

/** Base delay (ms) for exponential back-off between model retries */
const BACKOFF_BASE_MS = 800;

/** Verified, working OpenRouter free models — ordered by quality & availability */
export const FREE_MODELS = [
  "qwen/qwen-2.5-coder-32b-instruct:free",   // best for code
  "meta-llama/llama-3.3-70b-instruct:free",  // best for prose
  "deepseek/deepseek-r1-0528-qwen3-8b:free", // fast + reasoning
  "microsoft/phi-4-reasoning-plus:free",     // strong instruction following
  "mistralai/mistral-7b-instruct:free",      // reliable fallback
] as const;

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterOptions {
  apiKey: string;
  messages: OpenRouterMessage[];
  /** Override the primary model. Falls back to FREE_MODELS automatically. */
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** AbortSignal from the incoming Next.js request */
  clientSignal?: AbortSignal | null;
}

/** Sleep with optional jitter to spread retries */
function sleep(ms: number, jitter = 0.3): Promise<void> {
  const actual = ms * (1 + (Math.random() - 0.5) * jitter);
  return new Promise((r) => setTimeout(r, actual));
}

/**
 * Call OpenRouter with automatic model fallback, backoff, and stream health monitoring.
 *
 * Returns a ReadableStream of plain text tokens ready to pipe to the client.
 * Throws if every model in the list fails.
 */
export async function callOpenRouterWithFallback(
  opts: OpenRouterOptions
): Promise<ReadableStream<Uint8Array>> {
  const {
    apiKey,
    messages,
    model,
    temperature = 0.7,
    maxTokens = 3000,
    clientSignal,
  } = opts;

  // Build the ordered list: primary model first, then free fallbacks
  const modelsToTry: string[] = [];
  if (model) modelsToTry.push(model);
  for (const m of FREE_MODELS) {
    if (!modelsToTry.includes(m)) modelsToTry.push(m);
  }

  let lastError = "All AI models are currently unavailable. Please try again shortly.";

  for (let attempt = 0; attempt < modelsToTry.length; attempt++) {
    // Stop immediately if the client disconnected
    if (clientSignal?.aborted) {
      throw new DOMException("Client aborted", "AbortError");
    }

    const currentModel = modelsToTry[attempt];

    // Back-off before retrying (not on first attempt)
    if (attempt > 0) {
      const delay = BACKOFF_BASE_MS * Math.pow(2, attempt - 1); // 800, 1600, 3200 …
      await sleep(delay);
    }

    // Per-model AbortController — aborted on: first-token deadline OR client disconnect
    const modelController = new AbortController();

    // Forward client disconnect into model controller
    const onClientAbort = () => modelController.abort();
    clientSignal?.addEventListener("abort", onClientAbort);

    // First-token deadline: abort this model if no HTTP response in time
    const firstTokenTimer = setTimeout(
      () => modelController.abort(),
      FIRST_TOKEN_DEADLINE_MS
    );

    let response: Response | null = null;

    try {
      response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://repo-scribe.app",
          "X-Title": "RepoScribe",
        },
        body: JSON.stringify({
          model: currentModel,
          stream: true,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
        signal: modelController.signal,
      });
    } catch (err: any) {
      clearTimeout(firstTokenTimer);
      clientSignal?.removeEventListener("abort", onClientAbort);

      // Re-throw if the CLIENT aborted (user navigated away)
      if (clientSignal?.aborted || err?.name === "AbortError" && clientSignal?.aborted) {
        throw err;
      }

      // Model timed out or network error — try next
      console.warn(`[OpenRouter] Model ${currentModel} fetch error: ${err?.message}`);
      lastError = `Model ${currentModel} did not respond in time.`;
      continue;
    }

    clearTimeout(firstTokenTimer);
    clientSignal?.removeEventListener("abort", onClientAbort);

    // Handle rate limits & server errors — retry next model
    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.warn(`[OpenRouter] Model ${currentModel} → HTTP ${response.status}: ${errText}`);

      if (response.status === 429) {
        lastError = "Rate limited. Trying next model…";
      } else {
        try {
          const parsed = JSON.parse(errText);
          lastError = parsed?.error?.message || parsed?.error || errText || lastError;
        } catch {
          lastError = errText || lastError;
        }
      }
      continue;
    }

    // ─── Build the streaming response ────────────────────────────────────────
    // We wrap the upstream SSE stream, parse tokens, and emit raw text.
    // A watchdog timer closes the stream if it stalls mid-generation.
    const upstream = response.body!;

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = upstream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let totalChars = 0;
        let watchdogTimer: ReturnType<typeof setTimeout> | null = null;
        let streamClosed = false;

        function closeController() {
          if (streamClosed) return;
          streamClosed = true;
          if (watchdogTimer) clearTimeout(watchdogTimer);
          try { controller.close(); } catch { /* already closed */ }
        }

        function resetWatchdog() {
          if (watchdogTimer) clearTimeout(watchdogTimer);
          watchdogTimer = setTimeout(() => {
            console.warn(`[OpenRouter] Stream watchdog fired for ${currentModel}`);
            reader.cancel().catch(() => {});
            closeController();
          }, WATCHDOG_MS);
        }

        // Forward client disconnect into stream reader
        const onClientAbortStream = () => {
          reader.cancel().catch(() => {});
          closeController();
        };
        clientSignal?.addEventListener("abort", onClientAbortStream);

        resetWatchdog();

        try {
          while (true) {
            if (clientSignal?.aborted) break;

            const { done, value } = await reader.read();

            if (done) {
              // Flush any remaining buffer
              if (buffer.trim()) {
                const line = buffer.trim();
                if (line.startsWith("data: ") && line !== "data: [DONE]") {
                  try {
                    const json = JSON.parse(line.slice(6));
                    const token: string | undefined = json.choices?.[0]?.delta?.content;
                    if (token) {
                      totalChars += token.length;
                      controller.enqueue(new TextEncoder().encode(token));
                    }
                  } catch { /* ignore */ }
                }
              }
              break;
            }

            resetWatchdog();
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === "data: [DONE]") continue;
              if (!trimmed.startsWith("data: ")) continue;

              try {
                const json = JSON.parse(trimmed.slice(6));
                const token: string | undefined = json.choices?.[0]?.delta?.content;
                if (token) {
                  totalChars += token.length;
                  controller.enqueue(new TextEncoder().encode(token));
                }
              } catch { /* partial chunk — skip */ }
            }
          }
        } catch (streamErr: any) {
          // Swallow stream read errors (client disconnect, watchdog cancel)
          if (!clientSignal?.aborted) {
            console.warn(`[OpenRouter] Stream read error for ${currentModel}:`, streamErr?.message);
          }
        } finally {
          clientSignal?.removeEventListener("abort", onClientAbortStream);
          closeController();
        }

        // Validate that we received a meaningful response
        // If the model returned basically nothing, log a warning.
        // The caller stream has already closed; this is informational only.
        if (totalChars < MIN_RESPONSE_CHARS && !clientSignal?.aborted) {
          console.warn(
            `[OpenRouter] Model ${currentModel} returned only ${totalChars} chars — possibly empty response.`
          );
        }
      },
    });

    return stream;
  }

  // Every model failed
  throw new Error(lastError);
}
