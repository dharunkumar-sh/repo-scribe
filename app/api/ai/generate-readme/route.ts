import { NextRequest, NextResponse } from "next/server";
import { buildIntelligentSystemPrompt } from "@/lib/templateEngine";
import { callOpenRouterWithFallback } from "@/lib/openrouter";

/** Allow up to 90 seconds for free models that can be slow to respond */
export const maxDuration = 120;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const PRIMARY_MODEL = process.env.OPENROUTER_MODEL || undefined;

// ─── GitHub context fetcher ───────────────────────────────────────────────────

async function fetchGitHubRepoContext(repoUrl: string): Promise<string> {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?\s]+)/);
    if (!match) return "";
    const [, owner, repo] = match;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "RepoScribe-App",
    };

    const [repoRes, packageRes, readmeRes] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, { headers }),
    ]);

    let context = "";
    let defaultBranch = "main";

    if (repoRes.status === "fulfilled" && repoRes.value.ok) {
      const data = await repoRes.value.json();
      defaultBranch = data.default_branch || "main";
      context += `Repository: ${data.full_name}\n`;
      context += `Description: ${data.description || "No description"}\n`;
      context += `Language: ${data.language || "Unknown"}\n`;
      context += `Stars: ${data.stargazers_count} | Forks: ${data.forks_count}\n`;
      context += `Topics: ${(data.topics || []).join(", ") || "None"}\n`;
      context += `License: ${data.license?.name || "None"}\n`;
    }

    // Repository file tree (up to 150 paths for structural context)
    try {
      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
        { headers }
      );
      if (treeRes.ok) {
        const treeData = await treeRes.json();
        if (treeData?.tree) {
          const paths = (treeData.tree as { path: string }[])
            .map((t) => t.path)
            .slice(0, 150);
          context += `\nRepository File Tree (Partial):\n${paths.join("\n")}\n`;
        }
      }
    } catch (e) {
      console.warn("[RepoScribe] Error fetching repository tree:", e);
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

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const clientSignal = req.signal;

  try {
    const body = await req.json();
    const { repoUrl, prompt, theme } = body as {
      repoUrl?: string;
      prompt?: string;
      theme?: string;
    };

    // Fetch GitHub repo context (non-blocking if it fails)
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

    const systemPrompt = buildIntelligentSystemPrompt(theme || null);

    // Delegate all model retry / fallback / streaming logic to the shared utility
    const stream = await callOpenRouterWithFallback({
      apiKey: OPENROUTER_API_KEY,
      model: PRIMARY_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      maxTokens: 8000,
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
    console.error("[generate-readme] Unhandled error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
