const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const FIRST_TOKEN_DEADLINE_MS = 25_000;

const WATCHDOG_MS = 12_000;

const MIN_RESPONSE_CHARS = 50;

const BACKOFF_BASE_MS = 800;

export const FREE_MODELS = [
  "qwen/qwen3-coder:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "poolside/laguna-m.1:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "cohere/north-mini-code:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "google/gemma-4-31b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "poolside/laguna-xs-2.1:free",
  "poolside/laguna-xs.2:free",
  "openai/gpt-oss-20b:free",
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
] as const;
export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterOptions {
  apiKey: string;
  messages: OpenRouterMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  clientSignal?: AbortSignal | null;
}

function sleep(ms: number, jitter = 0.3): Promise<void> {
  const actual = ms * (1 + (Math.random() - 0.5) * jitter);
  return new Promise((r) => setTimeout(r, actual));
}

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

  const modelsToTry: string[] = [];
  if (model) modelsToTry.push(model);
  for (const m of FREE_MODELS) {
    if (!modelsToTry.includes(m)) modelsToTry.push(m);
  }

  let lastError = "All AI models are currently unavailable. Please try again shortly.";

  for (let attempt = 0; attempt < modelsToTry.length; attempt++) {
    if (clientSignal?.aborted) {
      throw new DOMException("Client aborted", "AbortError");
    }

    const currentModel = modelsToTry[attempt];

    if (attempt > 0) {
      const delay = BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
      await sleep(delay);
    }

    const modelController = new AbortController();

    const onClientAbort = () => modelController.abort();
    clientSignal?.addEventListener("abort", onClientAbort);

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

      if (clientSignal?.aborted || err?.name === "AbortError" && clientSignal?.aborted) {
        throw err;
      }
      console.warn(`[OpenRouter] Model ${currentModel} fetch error: ${err?.message}`);
      lastError = `Model ${currentModel} did not respond in time.`;
      continue;
    }

    clearTimeout(firstTokenTimer);
    clientSignal?.removeEventListener("abort", onClientAbort);

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
          try { controller.close(); } catch {}
        }

        function resetWatchdog() {
          if (watchdogTimer) clearTimeout(watchdogTimer);
          watchdogTimer = setTimeout(() => {
            console.warn(`[OpenRouter] Stream watchdog fired for ${currentModel}`);
            reader.cancel().catch(() => {});
            closeController();
          }, WATCHDOG_MS);
        }

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
                  } catch {}
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
              } catch {}
            }
          }
        } catch (streamErr: any) {
          if (!clientSignal?.aborted) {
            console.warn(`[OpenRouter] Stream read error for ${currentModel}:`, streamErr?.message);
          }
        } finally {
          clientSignal?.removeEventListener("abort", onClientAbortStream);
          closeController();
        }

        if (totalChars < MIN_RESPONSE_CHARS && !clientSignal?.aborted) {
          console.warn(
            `[OpenRouter] Model ${currentModel} returned only ${totalChars} chars — possibly empty response.`
          );
        }
      },
    });

    return stream;
  }

  throw new Error(lastError);
}
