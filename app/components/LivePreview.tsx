"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Copy, FileText, Code2 } from "lucide-react";
import { useState } from "react";

export default function LivePreview() {
  const [url, setUrl] = useState("https://github.com/facebook/react");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsGenerating(true);
    setGenerated(false);
    
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <section className="py-32 relative overflow-hidden bg-linear-to-b from-transparent to-white/2">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Try the <span className="text-gradient">Live Preview</span>
          </h2>
          <p className="text-muted text-lg">
            Experience the magic right now. Drop any public GitHub repository link below and watch RepoScribe generate a perfect README.
          </p>
        </div>

        <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[600px]">
          
          {/* Left Panel: Input */}
          <div className="w-full lg:w-1/3 bg-[#09090B] p-8 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center">
            <div className="mb-8">
              <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-[#FAFAFA]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Connect Repository</h3>
              <p className="text-sm text-[#A1A1AA]">
                Enter a public GitHub URL to begin the AI analysis.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#E4E4E7]">GitHub URL</label>
                <div className="relative">
                  <input 
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[#FAFAFA] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isGenerating || !url}
                className="w-full bg-[#FAFAFA] text-black hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-[#FAFAFA] py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <>
                    Generate Preview
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel: Preview */}
          <div className="w-full lg:w-2/3 bg-[#0a0a0c] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-12 bg-white/[0.02] border-b border-white/5 flex items-center px-4 justify-between z-10">
              <div className="flex items-center gap-2 text-sm text-[#A1A1AA] font-mono">
                <FileText className="w-4 h-4" />
                README.md
              </div>
              {generated && (
                <button className="flex items-center gap-1.5 text-xs font-medium text-[#FAFAFA] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors">
                  <Copy className="w-3 h-3" />
                  Copy Code
                </button>
              )}
            </div>

            <div className="p-8 pt-20 h-full overflow-y-auto font-sans text-[#E4E4E7]">
              {!isGenerating && !generated && (
                <div className="h-full flex flex-col items-center justify-center text-[#A1A1AA]">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p>Awaiting repository URL...</p>
                </div>
              )}

              {isGenerating && (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex gap-2">
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 rounded-full bg-[#A855F7]" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 rounded-full bg-[#22D3EE]" />
                  </div>
                  <p className="text-[#A1A1AA] font-mono text-sm animate-pulse">Processing repository contents...</p>
                </div>
              )}

              {generated && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert max-w-none"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
                    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
                  </div>
                  
                  <h1 className="text-4xl font-bold text-white mb-4 border-b border-white/10 pb-4">React</h1>
                  <p className="text-lg text-[#A1A1AA] mb-8">The library for web and native user interfaces.</p>

                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">Installation</h2>
                  <div className="bg-black/50 p-4 rounded-lg border border-white/5 mb-8 font-mono text-sm text-[#22D3EE]">
                    npm install react react-dom
                  </div>

                  <h2 className="text-2xl font-semibold text-white mb-4 mt-8">Usage</h2>
                  <div className="bg-black/50 p-4 rounded-lg border border-white/5 mb-8 font-mono text-sm">
                    <span className="text-[#A855F7]">import</span> {'{ useState }'} <span className="text-[#A855F7]">from</span> <span className="text-green-400">'react'</span>;<br/><br/>
                    <span className="text-[#A855F7]">function</span> <span className="text-[#7C3AED]">Counter</span>() {'{'}<br/>
                    &nbsp;&nbsp;<span className="text-[#A855F7]">const</span> [count, setCount] = <span className="text-[#7C3AED]">useState</span>(0);<br/>
                    &nbsp;&nbsp;<span className="text-[#A855F7]">return</span> (<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;{`<button onClick={() => setCount(count + 1)}>`}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`You clicked {count} times`}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;{`</button>`}<br/>
                    &nbsp;&nbsp;);<br/>
                    {'}'}
                  </div>

                  <ul className="space-y-2 mt-8">
                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> Declarative</li>
                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> Component-Based</li>
                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> Learn Once, Write Anywhere</li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
