"use client";

import { useState, useEffect, useRef } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { useGithubStore } from "@/store/useGithubStore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Wand2, Save, Eye, Code, Copy, Check, RefreshCw, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { SavedReadme } from "@/lib/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { useHistory } from "@/context/HistoryContext";

const defaultTemplate = `# Hi there 👋, I'm {name}

I'm a passionate developer focusing on building great software.

## 🚀 About Me
- 🔭 I'm currently working on exciting projects
- 🌱 I'm currently learning modern web technologies
- 💬 Ask me about anything related to tech
- 📫 How to reach me: {email}

## 💻 Tech Stack
- Frontend: React, Next.js, Tailwind CSS
- Backend: Node.js, Python, Go

## 📈 GitHub Stats
![GitHub stats](https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&theme=tokyonight&hide_border=true)
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username={username}&layout=compact&theme=tokyonight&hide_border=true)
`;

export default function GitHubReadmePage() {
  const { profile, repos, isConnected } = useGithubStore();
  const { user } = useAuth();
  const { addActivity } = useHistory();

  const searchParams = useSearchParams();
  const router = useRouter();
  const readmeId = searchParams.get("id");
  const isNew = searchParams.get("new") === "true";

  const [markdown, setMarkdown] = useState(defaultTemplate);
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(defaultTemplate);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("Profile README");

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    const fetchData = async () => {
      try {
        if (readmeId) {
          const docRef = doc(db, "saved_readmes", user.uid);
          const snap = await getDoc(docRef);
          if (active && snap.exists() && snap.data().items) {
            const item = snap.data().items.find((i: SavedReadme) => i.id === readmeId);
            if (item) {
              setMarkdown(item.markdown);
              setTitle(item.title);
            } else {
              toast.error("README not found");
              router.push("/dashboard/collections");
            }
          }
        } else if (!isNew) {
          const docRef = doc(db, "readmes", user.uid);
          const docSnap = await getDoc(docRef);
          if (active && docSnap.exists()) {
            const data = docSnap.data();
            if (data.markdown) {
              setMarkdown(data.markdown);
            }
          }
        } else {
          setMarkdown("# New Custom README\n\nStart typing your content here...");
          setTitle("Untitled README");
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error fetching README:", err);
        }
      }
    };

    fetchData();
    return () => { active = false; };
  }, [user, readmeId, isNew, router]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedMarkdown(markdown), 300);
    return () => clearTimeout(handler);
  }, [markdown]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleGenerate = async () => {
    if (!profile) {
      toast.error("Connect your GitHub account first.");
      return;
    }

    // Abort any prior stream
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsGenerating(true);
    setMarkdown("");
    setActiveTab("preview");

    // Extract top repos and languages from store
    const topRepos = [...(repos || [])]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description || "",
        language: r.language || "Unknown",
        stars: r.stargazers_count || 0,
      }));

    const langCounts: Record<string, number> = {};
    repos?.forEach((r) => {
      if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
    });
    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([lang]) => lang);

    try {
      const res = await fetch("/api/ai/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          login: profile.login,
          bio: profile.bio,
          email: profile.email,
          location: profile.location,
          company: profile.company,
          blog: profile.blog,
          publicRepos: profile.public_repos,
          followers: profile.followers,
          topRepos,
          topLanguages,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate profile README");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMarkdown((prev) => prev + chunk);
      }

      toast.success("Profile README generated!");
      addActivity(
        `Generated profile README for @${profile?.login || "user"}`,
        "generate",
        "success"
      ).catch(() => {});
    } catch (err: any) {
      if (err.name === "AbortError" || err.message?.includes("aborted") || err.message?.includes("AbortError")) return;
      console.error(err);
      toast.error(err.message || "Failed to generate README. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save.");
      return;
    }
    setIsSaving(true);
    try {
      if (readmeId) {
        const docRef = doc(db, "saved_readmes", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const items = snap.data().items || [];
          const updatedItems = items.map((i: SavedReadme) =>
            i.id === readmeId ? { ...i, title, markdown, updatedAt: new Date().toISOString() } : i
          );
          await setDoc(docRef, { items: updatedItems }, { merge: true });
          toast.success("README updated!");
        }
      } else if (isNew) {
        const newId = Date.now().toString();
        const docRef = doc(db, "saved_readmes", user.uid);
        const snap = await getDoc(docRef);
        const items = snap.exists() && Array.isArray(snap.data().items) ? snap.data().items : [];

        const newReadme: SavedReadme = {
          id: newId,
          title: title || "Untitled README",
          description: "Created manually",
          markdown,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFavorite: false,
          collectionIds: [],
        };

        items.push(newReadme);
        await setDoc(docRef, { items }, { merge: true });
        toast.success("New README saved!");
        router.push(`/dashboard/readme?id=${newId}`);
      } else {
        const docRef = doc(db, "readmes", user.uid);
        await setDoc(docRef, { markdown, updatedAt: new Date().toISOString() }, { merge: true });
        toast.success("Profile README saved!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save README.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isConnected && !readmeId && !isNew) {
    return (
      <div className="text-center py-20 text-gray-400">
        Please connect your GitHub account to generate a Profile README.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {(readmeId || isNew) && (
            <Link
              href="/dashboard/collections"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Collections
            </Link>
          )}
          {readmeId || isNew ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#7C3AED] outline-none transition-all px-1 py-0.5 max-w-sm"
                placeholder="README Title"
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-1">Profile README Generator</h2>
              <p className="text-sm text-gray-400">Create a stunning GitHub profile with AI assistance.</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!readmeId && !isNew && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                  />
                  Generating…
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  AI Generate
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <GlassCard className="flex-1 flex flex-col min-h-[500px] overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-1 bg-[#09090B] p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "edit" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Code className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "preview" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>

          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-[#A855F7] font-medium">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#A855F7]"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              AI is writing…
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#A855F7] hover:bg-[#7C3AED]/20 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving…" : "Save"}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {isCopied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>

        {/* Editor / Preview area */}
        <div className="flex-1 relative bg-[#09090B]/50">
          {activeTab === "edit" ? (
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="absolute inset-0 w-full h-full p-6 bg-transparent text-gray-300 font-mono text-sm focus:outline-none resize-none"
              placeholder="Write your markdown here..."
            />
          ) : (
            <div className="absolute inset-0 w-full h-full p-6 overflow-y-auto prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-6 mb-4 border-b border-white/10 pb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3 border-b border-white/5 pb-1">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-bold text-white mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-300 leading-relaxed my-3">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-2 my-4 pl-4 text-gray-300">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 my-4 pl-4 text-gray-300">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-300">{children}</li>,
                  code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-[#22D3EE] font-mono">{children}</code>,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:underline">{children}</a>,
                  img: ({ src, alt }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={alt || ""} className="inline-block max-w-full rounded-md border border-white/5 my-2 mr-4" />
                  ),
                }}
              >
                {debouncedMarkdown}
              </ReactMarkdown>
              {isGenerating && (
                <span className="inline-block w-0.5 h-4 bg-[#A855F7] animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
