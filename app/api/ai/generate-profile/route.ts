import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const MODEL = process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-coder-32b-instruct:free";

export async function POST(req: NextRequest) {
  const signal = req.signal;

  try {
    const body = await req.json();
    const { name, login, bio, email, location, company, blog, publicRepos, followers, topRepos, topLanguages } = body as {
      name?: string;
      login?: string;
      bio?: string;
      email?: string;
      location?: string;
      company?: string;
      blog?: string;
      publicRepos?: number;
      followers?: number;
      topRepos?: Array<{ name: string; description: string; language: string; stars: number }>;
      topLanguages?: string[];
    };

    const systemPrompt = `You are an expert at crafting stunning, personalized GitHub profile READMEs.

Your profile README must:
- Have a creative, eye-catching header with the developer's name and a catchy tagline
- Include animated GitHub stats widgets (github-readme-stats, github-readme-streak-stats)
- Show programming language badges using shields.io
- Include a "What I'm working on" or "About Me" section that feels personal
- Add a GitHub contribution graph if applicable  
- Use tasteful emoji for visual hierarchy
- Reference the user's actual projects and interests
- Keep it energetic, professional, and authentically developer-voiced

Use these GitHub stats widgets (replace {username} with actual username):
- Stats: https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&theme=tokyonight&hide_border=true
- Streak: https://github-readme-streak-stats.herokuapp.com/?user={username}&theme=tokyonight&hide_border=true
- Top Langs: https://github-readme-stats.vercel.app/api/top-langs/?username={username}&layout=compact&theme=tokyonight&hide_border=true

Output ONLY the raw Markdown. No preamble, no trailing comments.`;

    const userMessage = `Create a beautiful GitHub profile README for this developer:

Name: ${name || login || "Developer"}
Username: ${login || "username"}
Bio: ${bio || "Passionate developer"}
Location: ${location || ""}
Company: ${company || ""}
Website: ${blog || ""}
Email: ${email || ""}
Public Repos: ${publicRepos || 0}
Followers: ${followers || 0}

${topLanguages?.length ? `Top Languages: ${topLanguages.join(", ")}` : ""}

${topRepos?.length ? `Featured Projects:\n${topRepos.map(r => `- ${r.name}: ${r.description || "No description"} (${r.language || "Unknown"}, ⭐${r.stars})`).join("\n")}` : ""}

Generate a stunning, personalized profile README now.`;

    const modelsToTry = [MODEL];
    const fallbacks = [
      "qwen/qwen-2.5-coder-32b-instruct:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemma-2-9b-it:free",
      "mistralai/mistral-7b-instruct:free",
    ];
    for (const f of fallbacks) {
      if (!modelsToTry.includes(f)) {
        modelsToTry.push(f);
      }
    }

    let response: Response | null = null;
    let lastErrorMsg = "";
    let lastStatus = 500;

    for (const model of modelsToTry) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const onAbort = () => {
        controller.abort();
      };
      if (signal) {
        signal.addEventListener("abort", onAbort);
      }

      try {
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://repo-scribe.app",
            "X-Title": "RepoScribe",
          },
          body: JSON.stringify({
            model: model,
            stream: true,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage },
            ],
            temperature: 0.8,
            max_tokens: 2500,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }

        if (response.ok) {
          break;
        }

        lastStatus = response.status;
        lastErrorMsg = await response.text();
        console.warn(`Model ${model} failed with status ${lastStatus}. Error: ${lastErrorMsg}`);
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
        if (err?.name === "AbortError" && (!signal || !signal.aborted)) {
          console.warn(`Model ${model} connection timed out, trying next...`);
          lastStatus = 408;
          lastErrorMsg = "Connection timed out";
          continue;
        }
        if (err?.name === "AbortError" || signal?.aborted) {
          throw err;
        }
        lastStatus = 500;
        lastErrorMsg = err?.message || String(err);
        console.error(`Fetch failed for model ${model}:`, err);
      }
    }

    if (!response || !response.ok) {
      let parsedError = lastErrorMsg;
      try {
        const parsed = JSON.parse(lastErrorMsg);
        parsedError = parsed.error?.message || parsed.error || lastErrorMsg;
      } catch {
        // Not JSON
      }
      return NextResponse.json({ error: parsedError }, { status: lastStatus });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response!.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // Abort upstream reader when client disconnects
        signal?.addEventListener("abort", () => {
          reader.cancel().catch(() => {});
          controller.close();
        });

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              if (buffer) {
                const line = buffer.trim();
                if (line.startsWith("data: ") && line !== "data: [DONE]") {
                  try {
                    const json = JSON.parse(line.slice(6));
                    const token = json.choices?.[0]?.delta?.content;
                    if (token) {
                      controller.enqueue(new TextEncoder().encode(token));
                    }
                  } catch {}
                }
              }
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

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
        } catch {
          if (controller.desiredSize !== null) {
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
    if (err?.name === "AbortError") {
      return new Response(null, { status: 204 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
