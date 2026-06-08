import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const MODEL = process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free";

async function fetchGitHubRepoContext(repoUrl: string): Promise<string> {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?\s]+)/);
    if (!match) return "";
    const [, owner, repo] = match;
    const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };

    const [repoRes, packageRes, readmeRes] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, { headers }),
    ]);

    let context = "";

    if (repoRes.status === "fulfilled" && repoRes.value.ok) {
      const data = await repoRes.value.json();
      context += `Repository: ${data.full_name}\n`;
      context += `Description: ${data.description || "No description"}\n`;
      context += `Language: ${data.language || "Unknown"}\n`;
      context += `Stars: ${data.stargazers_count} | Forks: ${data.forks_count}\n`;
      context += `Topics: ${(data.topics || []).join(", ") || "None"}\n`;
      context += `License: ${data.license?.name || "None"}\n`;
    }

    if (packageRes.status === "fulfilled" && packageRes.value.ok) {
      const fileData = await packageRes.value.json();
      const raw = Buffer.from(fileData.content, "base64").toString("utf-8");
      const pkg = JSON.parse(raw);
      context += `\npackage.json summary:\n`;
      context += `  name: ${pkg.name}\n`;
      context += `  version: ${pkg.version}\n`;
      context += `  description: ${pkg.description || ""}\n`;
      context += `  dependencies: ${Object.keys(pkg.dependencies || {}).slice(0, 15).join(", ")}\n`;
      context += `  devDependencies: ${Object.keys(pkg.devDependencies || {}).slice(0, 10).join(", ")}\n`;
      if (pkg.scripts) {
        context += `  scripts: ${Object.keys(pkg.scripts).join(", ")}\n`;
      }
    }

    if (readmeRes.status === "fulfilled" && readmeRes.value.ok) {
      const fileData = await readmeRes.value.json();
      const raw = Buffer.from(fileData.content, "base64").toString("utf-8");
      context += `\nExisting README snippet:\n${raw.slice(0, 500)}...\n`;
    }

    return context;
  } catch {
    return "";
  }
}

function buildSystemPrompt(theme: string | null): string {
  const styleGuide = theme
    ? `You are generating a README in the style of: "${theme}". Match the expected layout and emphasis for that template type.`
    : `You are a senior developer writing a professional, well-structured README.`;

  return `${styleGuide}

Your README must:
- Use clean, professional Markdown
- Include badges (shields.io) where relevant
- Have a beautiful header with project name and tagline
- Include sections: Overview, Features, Tech Stack, Getting Started (Prerequisites + Installation), Usage, Screenshots placeholder if applicable, Contributing, License
- Use emoji sparingly but effectively for visual hierarchy
- Write crisp, developer-friendly prose (not marketing fluff)
- Include code blocks with syntax highlighting for install/usage steps
- Be ready to copy-paste directly to GitHub

Output ONLY the raw Markdown. No explanations, no preamble, no trailing comments.`;
}

export async function POST(req: NextRequest) {
  const signal = req.signal;

  try {
    const body = await req.json();
    const { repoUrl, prompt, theme } = body as {
      repoUrl?: string;
      prompt?: string;
      theme?: string;
    };

    // Build context
    let repoContext = "";
    if (repoUrl) {
      repoContext = await fetchGitHubRepoContext(repoUrl);
    }

    // Build user message
    let userMessage = "";
    if (repoContext) {
      userMessage += `Here is the repository context:\n\n${repoContext}\n\n`;
    }
    if (prompt) {
      userMessage += `Additional instructions: ${prompt}\n\n`;
    }
    if (repoUrl && !repoContext) {
      userMessage += `Repository URL: ${repoUrl}\n\n`;
    }
    userMessage += "Generate the README now.";

    const systemPrompt = buildSystemPrompt(theme || null);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://repo-scribe.app",
        "X-Title": "RepoScribe",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
      signal,
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    // Pipe the SSE stream, forward client abort to upstream
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        // Abort upstream reader when client disconnects
        signal?.addEventListener("abort", () => {
          reader.cancel().catch(() => {});
          controller.close();
        });

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === "data: [DONE]") continue;
              if (trimmed.startsWith("data: ")) {
                try {
                  const json = JSON.parse(trimmed.slice(6));
                  const token = json.choices?.[0]?.delta?.content;
                  if (token) {
                    controller.enqueue(new TextEncoder().encode(token));
                  }
                } catch {
                  // Ignore partial chunk parse errors
                }
              }
            }
          }
          controller.close();
        } catch (err: any) {
          // Swallow abort errors silently
          if (!controller.desiredSize === null) {
            controller.close();
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: any) {
    // Don't surface abort as a 500 error
    if (err?.name === "AbortError") {
      return new Response(null, { status: 204 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
