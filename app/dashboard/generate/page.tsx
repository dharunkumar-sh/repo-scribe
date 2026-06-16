"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import { Sparkles, CheckCircle2, ArrowRight, Star, Copy, Check, Eye, Code, ArrowLeft, FolderPlus, Plus, Download, LayoutTemplate, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useHistory } from "@/context/HistoryContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { hasToSViolation } from "@/lib/censor";
import { Collection } from "@/lib/types";
import { templates } from "@/lib/templates";
import dynamic from "next/dynamic";

const MarkdownRenderer = dynamic(() => import("@/app/dashboard/components/MarkdownRenderer"), {
  ssr: false,
  loading: () => <div className="text-gray-400 p-4">Loading preview...</div>,
});

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

  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [showInlineCreate, setShowInlineCreate] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedModalTemplateId, setSelectedModalTemplateId] = useState<number | null>(null);
  const [templateSearch, setTemplateSearch] = useState("");

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

  // Fetch collections
  useEffect(() => {
    let active = true;
    if (!user) return;

    const fetchCollections = async () => {
      try {
        const docRef = doc(db, "collections", user.uid);
        const docSnap = await getDoc(docRef);
        if (active && docSnap.exists()) {
          const data = docSnap.data();
          if (data && Array.isArray(data.items)) {
            setCollections(data.items);
            if (data.items.length > 0) {
              setSelectedCollectionId(String(data.items[0].id));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
    return () => {
      active = false;
    };
  }, [user]);

  // Auto-start if template prompt or repository URL is pre-filled
  // Guard with a ref so React StrictMode double-mount doesn't fire twice
  useEffect(() => {
    if (autoStartedRef.current) return;
    const prompt = searchParams.get("prompt");
    const themeParam = searchParams.get("theme");
    const repoUrl = searchParams.get("url");

    if (repoUrl && !themeParam && !prompt) {
      // Just a URL from repositories page -> show template modal
      setShowTemplateModal(true);
      autoStartedRef.current = true;
    } else if (repoUrl) {
      // Has repo URL (and maybe prompt/theme) -> just start
      autoStartedRef.current = true;
      setTimeout(() => {
        startGeneration(undefined, prompt || undefined, themeParam || undefined, repoUrl || undefined);
      }, 300);
    } else if (prompt || themeParam) {
      // Has template prompt/theme but no repo URL -> prompt user for URL
      autoStartedRef.current = true;
      toast.custom((t) => (
        <div className="bg-[#09090B] border border-[#7C3AED] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#A855F7] shrink-0" />
          <div>
            <p className="font-semibold text-sm">Template Selected: {themeParam}</p>
            <p className="text-xs text-gray-400">Please enter your GitHub repository URL to generate the README.</p>
          </div>
        </div>
      ), { duration: 5000 });
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

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim() || !user) return;
    setIsCreatingCollection(true);
    try {
      const docRef = doc(db, "collections", user.uid);
      const docSnap = await getDoc(docRef);
      let items: any[] = [];
      if (docSnap.exists() && Array.isArray(docSnap.data().items)) {
        items = docSnap.data().items;
      }
      const newId = Date.now();
      const newCollection: Collection = {
        id: newId,
        name: newCollectionName.trim(),
        count: 0,
        lastUpdated: "Just now",
        color: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-cyan-400",
      };
      items.push(newCollection);
      await setDoc(docRef, { items }, { merge: true });
      setCollections(items);
      setSelectedCollectionId(String(newId));
      setNewCollectionName("");
      setShowInlineCreate(false);
      toast.success("Collection created!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create collection");
    } finally {
      setIsCreatingCollection(false);
    }
  };

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
        collectionIds: selectedCollectionId ? [selectedCollectionId] : [],
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

  const handleDownload = () => {
    if (!streamedMarkdown) return;
    const blob = new Blob([streamedMarkdown], { type: "text/markdown" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
    toast.success("Downloaded README.md!");
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!url) {
                    toast.error("Please enter a GitHub repository URL.");
                    return;
                  }
                  if (theme) {
                    startGeneration(e);
                  } else {
                    setShowTemplateModal(true);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Repository URL
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
                      required
                    />
                  </div>
                </div>

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
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
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
                    <MarkdownRenderer
                      content={streamedMarkdown}
                      themeStyle={templates.find(t => t.name === theme)?.style || "classic"}
                    />
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

                    <div className="pt-2 border-t border-white/5">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Add to Collection</label>
                      {collections.length > 0 ? (
                        <div className="flex gap-3">
                          <select
                            value={selectedCollectionId}
                            onChange={(e) => setSelectedCollectionId(e.target.value)}
                            className="block w-full px-4 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none text-sm appearance-none"
                          >
                            <option value="">No Collection (General Library)</option>
                            {collections.map(col => (
                              <option key={col.id} value={String(col.id)}>{col.name}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setShowInlineCreate(!showInlineCreate)}
                            className="shrink-0 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm border border-white/10"
                            title="New Collection"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <FolderPlus className="w-5 h-5 text-gray-500 shrink-0" />
                            <p>You don't have any collections yet.</p>
                          </div>
                          {!showInlineCreate && (
                            <button
                              type="button"
                              onClick={() => setShowInlineCreate(true)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-xs font-medium whitespace-nowrap"
                            >
                              Create Collection
                            </button>
                          )}
                        </div>
                      )}

                      <AnimatePresence>
                        {showInlineCreate && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3"
                          >
                            <div className="flex gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                              <input
                                type="text"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                placeholder="New collection name"
                                className="block w-full px-3 py-2 bg-[#09090B] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCreateCollection();
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={handleCreateCollection}
                                disabled={isCreatingCollection || !newCollectionName.trim()}
                                className="shrink-0 px-3 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                              >
                                {isCreatingCollection ? "Adding…" : "Add"}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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

      {/* Template Selection Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#09090B]/80 backdrop-blur-md"
              onClick={() => setShowTemplateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#09090B] border border-white/10 w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white">Select a Template</h2>
                  <p className="text-sm text-gray-400">Choose a style for your generated README.</p>
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Search templates..."
                    className="block w-full pl-9 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div
                  onClick={() => setSelectedModalTemplateId(0)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    selectedModalTemplateId === 0
                      ? "bg-[#7C3AED]/10 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedModalTemplateId === 0 ? "bg-[#7C3AED]" : "bg-white/10"}`}>
                    <Sparkles className={`w-5 h-5 ${selectedModalTemplateId === 0 ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">AI Auto-detect</h3>
                    <p className="text-sm text-gray-400 mt-1">Let AI analyze the repository and choose the best layout automatically.</p>
                  </div>
                  {selectedModalTemplateId === 0 && <CheckCircle2 className="w-5 h-5 text-[#A855F7]" />}
                </div>

                {templates
                  .filter((t) => t.name.toLowerCase().includes(templateSearch.toLowerCase()) || t.category.toLowerCase().includes(templateSearch.toLowerCase()))
                  .map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedModalTemplateId(template.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                        selectedModalTemplateId === template.id
                          ? "bg-[#7C3AED]/10 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedModalTemplateId === template.id ? "bg-[#7C3AED]" : "bg-white/10"}`}>
                        <LayoutTemplate className={`w-5 h-5 ${selectedModalTemplateId === template.id ? "text-white" : "text-gray-400"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{template.name}</h3>
                        <div className="text-xs text-[#A855F7] mt-0.5">{template.category}</div>
                        <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                      </div>
                      {selectedModalTemplateId === template.id && <CheckCircle2 className="w-5 h-5 text-[#A855F7]" />}
                    </div>
                  ))}
              </div>

              <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    let promptOverride: string | undefined = undefined;
                    let themeOverride: string | undefined = undefined;
                    if (selectedModalTemplateId === 0) {
                      promptOverride = "AI Auto-detect: Analyze the repository content, language, features, dependencies, and overall project purpose to dynamically construct the most appropriate README template, structure, and style specifically tailored for this project's stack.";
                      themeOverride = "Dynamic Auto-detect";
                    } else if (selectedModalTemplateId && selectedModalTemplateId > 0) {
                      const t = templates.find((t) => t.id === selectedModalTemplateId);
                      if (t) {
                        themeOverride = t.name;
                        promptOverride = `Generate a comprehensive README following the ${t.name} theme. It should have a ${t.style} style layout and include these key aspects: ${t.description}`;
                      }
                    }
                    startGeneration(undefined, promptOverride, themeOverride, url);
                  }}
                  disabled={selectedModalTemplateId === null}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
