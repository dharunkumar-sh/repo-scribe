"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { useGithubStore } from "@/store/useGithubStore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Wand2, Save, Eye, Code, Copy, Check, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

const defaultTemplate = `# Hi there 👋, I'm {name}

I'm a passionate developer focusing on building great software.

## 🚀 About Me
- 🔭 I’m currently working on exciting projects
- 🌱 I’m currently learning modern web technologies
- 💬 Ask me about anything related to tech
- 📫 How to reach me: {email}

## 💻 Tech Stack
- Frontend: React, Next.js, Tailwind CSS
- Backend: Node.js, Python, Go

## 📈 GitHub Stats
![GitHub stats](https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&theme=radium)
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username={username}&layout=compact&theme=radium)
`;

export default function GitHubReadmePage() {
  const { profile, isConnected } = useGithubStore();
  const { user } = useAuth();
  
  const [markdown, setMarkdown] = useState(defaultTemplate);
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(defaultTemplate);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch saved README from Firestore database on mount or user changes
  useEffect(() => {
    if (!user) return;
    let active = true;
    const fetchSavedReadme = async () => {
      try {
        const docRef = doc(db, "readmes", user.uid);
        const docSnap = await getDoc(docRef);
        if (active && docSnap.exists()) {
          const data = docSnap.data();
          if (data.markdown) {
            setMarkdown(data.markdown);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Error fetching README:", err);
        }
      }
    };
    fetchSavedReadme();
    return () => {
      active = false;
    };
  }, [user]);

  // 2. Debounce markdown updates for preview rendering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMarkdown(markdown);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [markdown]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI Generation
    setTimeout(() => {
      const generated = defaultTemplate
        .replace("{name}", profile?.name || profile?.login || "Developer")
        .replace("{username}", profile?.login || "username")
        .replace("{email}", profile?.email || "my@email.com");
      
      setMarkdown(generated);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save.");
      return;
    }
    setIsSaving(true);
    try {
      const docRef = doc(db, "readmes", user.uid);
      await setDoc(docRef, {
        markdown,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      toast.success("README saved to database!");
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

  if (!isConnected) {
    return (
      <div className="text-center py-20 text-gray-400">
        Please connect your GitHub account to generate a Profile README.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Profile README Generator</h2>
          <p className="text-sm text-gray-400">Create a stunning GitHub profile with AI assistance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] disabled:opacity-50"
          >
            {isGenerating ? <Wand2 className="w-4 h-4 animate-bounce" /> : <Wand2 className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "AI Generate"}
          </button>
        </div>
      </div>

      <GlassCard className="flex-1 flex flex-col min-h-[500px] overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-1 bg-[#09090B] p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "edit" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Code className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "preview" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#A855F7] hover:bg-[#7C3AED]/20 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Draft"}
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

        {/* Editor Area */}
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
                    <img src={src} alt={alt} className="inline-block max-w-full rounded-md border border-white/5 my-2 mr-4" />
                  ),
                }}
              >
                {debouncedMarkdown}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
