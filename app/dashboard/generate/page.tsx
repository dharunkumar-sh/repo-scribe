"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import { Sparkles, CheckCircle2, ArrowRight, Star, Copy, Check, Eye, Code, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useHistory } from "@/context/HistoryContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { hasToSViolation } from "@/lib/censor";
import ReactMarkdown from "react-markdown";

export default function GeneratePage() {
  const { user } = useAuth();
  const { addActivity } = useHistory();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [url, setUrl] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [theme, setTheme] = useState("");

  const [phase, setPhase] = useState<"idle" | "generating" | "streaming" | "done">("idle");
  const [streamedMarkdown, setStreamedMarkdown] = useState("");
  const [activeTab, setActiveTab] = useState<"raw" | "preview">("preview");
  const [isCopied, setIsCopied] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const streamContainerRef = useRef<HTMLDivElement>(null);
  // Guard against React StrictMode double-mount firing auto-start twice
  const autoStartedRef = useRef(false);

  useEffect(() => {
    const prompt = searchParams.get("prompt") || "";
    const themeName = searchParams.get("theme") || "";
    const repoUrl = searchParams.get("url") || "";
    if (prompt) setAiPrompt(prompt);
    if (themeName) setTheme(themeName);
    if (repoUrl) setUrl(repoUrl);
  }, [searchParams]);

  // Auto-scroll as tokens arrive
  useEffect(() => {
    if (phase === "streaming" && streamContainerRef.current) {
      streamContainerRef.current.scrollTop = streamContainerRef.current.scrollHeight;
    }
  }, [streamedMarkdown, phase]);

  // Clean up streaming on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Auto-start if template prompt or repository URL is pre-filled
  // Guard with a ref so React StrictMode double-mount doesn't fire twice
  useEffect(() => {
    if (autoStartedRef.current) return;
    const prompt = searchParams.get("prompt");
    const theme = searchParams.get("theme");
    const repoUrl = searchParams.get("url");
    if ((prompt && theme) || repoUrl) {
      autoStartedRef.current = true;
      setTimeout(() => {
        startGeneration(undefined, prompt || undefined, theme || undefined, repoUrl || undefined);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGeneration = useCallback(
    async (
      submitEvent?: React.FormEvent,
      overridePrompt?: string,
      overrideTheme?: string,
      overrideUrl?: string
    ) => {
      submitEvent?.preventDefault();

      const finalUrl = overrideUrl ?? url;
      const finalPrompt = overridePrompt ?? aiPrompt;
      const finalTheme = overrideTheme ?? theme;

      if (!finalUrl && !finalPrompt) {
        toast.error("Please enter a GitHub repository URL.");
        return;
      }

      if (finalPrompt) {
        const violation = hasToSViolation(finalPrompt);
        if (violation.violated) {
          toast.error(`Prompt violates Terms & Conditions: "${violation.word}"`);
          return;
        }
      }

      // Set title from URL or theme
      if (finalUrl) {
        const parts = finalUrl.split("/");
        const repoName = parts[parts.length - 1] || "My Project";
        setTitle(repoName.charAt(0).toUpperCase() + repoName.slice(1).replace(/-/g, " "));
        setDescription(`Generated from ${finalUrl}`);
      } else if (finalTheme) {
        setTitle(`${finalTheme} README`);
        setDescription(`Generated using ${finalTheme} template`);
      } else {
        setTitle("Generated README");
        setDescription("AI-generated README");
      }

      setPhase("generating");
      setStreamedMarkdown("");
      setActiveTab("preview");

      // Abort any prior stream
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/ai/generate-readme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            repoUrl: finalUrl || undefined,
            prompt: finalPrompt || undefined,
            theme: finalTheme || undefined,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to generate README");
        }

        setPhase("streaming");

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setStreamedMarkdown((prev) => prev + chunk);
        }

        setPhase("done");
        // Log to activity history
        const label = finalUrl
          ? `Generated README for ${finalUrl.split("/").slice(-2).join("/")}`
          : `Generated README using ${finalTheme || "custom"} template`;
        addActivity(label, "generate", "success").catch(() => {});
      } catch (err: any) {
        if (
          err.name === "AbortError" ||
          err.message?.includes("aborted") ||
          err.message?.includes("AbortError")
        ) {
          setPhase("idle");
          return;
        }
        console.error(err);
        toast.error(err.message || "Something went wrong. Please try again.");
        setPhase("idle");
      }
    },
    [url, aiPrompt, theme, addActivity]
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to save.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    if (!streamedMarkdown) {
      toast.error("Nothing to save yet.");
      return;
    }

    setIsSaving(true);
    const newId = Date.now().toString();

    try {
      const docRef = doc(db, "saved_readmes", user.uid);
      const docSnap = await getDoc(docRef);
      let items: any[] = [];
      if (docSnap.exists() && Array.isArray(docSnap.data().items)) {
        items = docSnap.data().items;
      }

      // Firestore does not accept `undefined` — use null for optional fields
      const newItem = {
        id: newId,
        title: title.trim(),
        description: description.trim() || null,
        markdown: streamedMarkdown,
        repoUrl: url || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite,
        collectionIds: [],
      };

      items.push(newItem);

      await setDoc(docRef, { items }, { merge: true });
      toast.success("README saved successfully!");
      router.push(`/dashboard/readme?id=${newId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save README");
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(streamedMarkdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const isStreaming = phase === "streaming";
  const isGenerating = phase === "generating";
  const isDone = phase === "done";
  const hasContent = streamedMarkdown.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {theme && (
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Templates
          </button>
        )}
        <h1 className="text-3xl font-bold mb-2">
          {theme ? (
            <>
              <span className="text-gradient">{theme}</span> Generator
            </>
          ) : (
            "AI README Generator"
          )}
        </h1>
        <p className="text-gray-400">
          {theme
            ? `Generating a professional README in the ${theme} style.`
            : "Transform any GitHub repository into a beautiful, professional README instantly."}
        </p>
      </motion.div>

      {/* Input form */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard className="p-8">
              <form onSubmit={(e) => startGeneration(e)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Repository URL <span className="text-gray-500 font-normal">(optional if template prompt loaded)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <GithubIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://github.com/username/repository"
                      className="block w-full pl-11 pr-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none"
                      required={!aiPrompt}
                    />
                  </div>
                </div>

                {aiPrompt && (
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20">
                    <Sparkles className="w-4 h-4 text-[#A855F7] mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{aiPrompt}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate with AI
                </button>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generating phase — pulsing orb */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="p-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#7C3AED] blur-3xl opacity-30 rounded-full animate-pulse scale-150" />
                <div className="w-24 h-24 bg-[#09090B] border border-white/10 rounded-3xl flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
                  <Sparkles className="w-12 h-12 text-[#A855F7] animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-white mb-1">Analyzing repository…</p>
                <p className="text-sm text-gray-400">Fetching context, detecting tech stack</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#7C3AED]"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streaming / Done — live markdown editor */}
      <AnimatePresence>
        {(isStreaming || isDone) && hasContent && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Status bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isStreaming ? (
                  <div className="flex items-center gap-2 text-sm text-[#A855F7] font-medium">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-[#A855F7]"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    Generating…
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    README ready
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Tab toggle */}
            <div className="flex items-center gap-1 bg-[#09090B] border border-white/10 rounded-xl p-1 w-fit">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "preview" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button
                onClick={() => setActiveTab("raw")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "raw" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Code className="w-4 h-4" /> Raw
              </button>
            </div>

            {/* Content area */}
            <GlassCard className="overflow-hidden">
              <div
                ref={streamContainerRef}
                className="min-h-[400px] max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
              >
                {activeTab === "preview" ? (
                  <div className="p-6 prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-4 mb-4 border-b border-white/10 pb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold text-white mt-4 mb-2">{children}</h3>,
                        p: ({ children }) => <p className="text-gray-300 leading-relaxed my-3">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-3 pl-2 text-gray-300">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2 text-gray-300">{children}</ol>,
                        li: ({ children }) => <li className="text-gray-300">{children}</li>,
                        code: ({ children, className }) => {
                          const isBlock = className?.includes("language-");
                          return isBlock ? (
                            <code className="block bg-[#0D0D10] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#22D3EE] font-mono overflow-x-auto my-3 whitespace-pre">{children}</code>
                          ) : (
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-[#22D3EE] font-mono">{children}</code>
                          );
                        },
                        pre: ({ children }) => <pre className="my-0 bg-transparent">{children}</pre>,
                        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#A855F7] hover:text-[#C084FC] hover:underline transition-colors">{children}</a>,
                        img: ({ src, alt }) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={src} alt={alt || ""} className="inline-block max-w-full rounded-md border border-white/5 my-2 mr-2" />
                        ),
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-[#7C3AED]/50 pl-4 my-4 text-gray-400 italic">{children}</blockquote>,
                        table: ({ children }) => <table className="w-full border-collapse my-4 text-sm">{children}</table>,
                        th: ({ children }) => <th className="border border-white/10 px-3 py-2 text-left font-semibold text-white bg-white/5">{children}</th>,
                        td: ({ children }) => <td className="border border-white/10 px-3 py-2 text-gray-300">{children}</td>,
                        hr: () => <hr className="border-white/10 my-6" />,
                      }}
                    >
                      {streamedMarkdown}
                    </ReactMarkdown>
                    {isStreaming && (
                      <span className="inline-block w-0.5 h-4 bg-[#A855F7] animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <pre className="p-6 text-gray-300 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
                      {streamedMarkdown}
                      {isStreaming && (
                        <span className="inline-block w-0.5 h-4 bg-[#A855F7] animate-pulse ml-0.5 align-middle" />
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Save form — only shown when done */}
            {isDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <GlassCard className="p-6">
                  <form onSubmit={handleSave} className="space-y-4">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-4">Save to Collections</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. My Awesome Project"
                          className="block w-full px-4 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Description <span className="text-gray-600">(optional)</span></label>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Short description"
                          className="block w-full px-4 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsFavorite(!isFavorite)}
                        title="Mark as Favourite"
                        className={`p-2.5 rounded-xl border transition-all ${
                          isFavorite ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" : "bg-[#09090B] border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isFavorite ? "fill-yellow-400" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPhase("idle"); setStreamedMarkdown(""); }}
                        className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all text-sm"
                      >
                        Generate Again
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] py-2.5 px-4 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 text-sm"
                      >
                        {isSaving ? "Saving…" : "Save & Edit"}
                        {!isSaving && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </form>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
