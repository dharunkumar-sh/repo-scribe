import { NextRequest, NextResponse } from "next/server";
import { callOpenRouterWithFallback } from "@/lib/openrouter";

/** Allow up to 90 seconds for free models that can be slow to respond */
export const maxDuration = 120;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const PRIMARY_MODEL = process.env.OPENROUTER_MODEL || undefined;

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const clientSignal = req.signal;

  try {
    const body = await req.json();
    const {
      name,
      login,
      bio,
      email,
      location,
      company,
      blog,
      publicRepos,
      followers,
      topRepos,
      topLanguages,
    } = body as {
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

${
  topRepos?.length
    ? `Featured Projects:\n${topRepos
        .map(
          (r) =>
            `- ${r.name}: ${r.description || "No description"} (${r.language || "Unknown"}, ⭐${r.stars})`
        )
        .join("\n")}`
    : ""
}

Generate a stunning, personalized profile README now.`;

    // Delegate all model retry / fallback / streaming logic to the shared utility
    const stream = await callOpenRouterWithFallback({
      apiKey: OPENROUTER_API_KEY,
      model: PRIMARY_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      maxTokens: 4000,
      clientSignal,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: any) {
    if (err?.name === "AbortError" || clientSignal?.aborted) {
      return new Response(null, { status: 204 });
    }
    console.error("[generate-profile] Unhandled error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
