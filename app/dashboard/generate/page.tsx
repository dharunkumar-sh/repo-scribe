"use client";

import { useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GeneratePage() {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    "Connecting to GitHub...",
    "Analyzing Repository...",
    "Detecting Tech Stack...",
    "Understanding Features...",
    "Generating README...",
    "Finalizing..."
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsGenerating(true);
    setStep(0);
    
    // Mock progression
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsGenerating(false), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI README Generator</h1>
        <p className="text-gray-400">Transform any GitHub repository into a beautiful, professional README.md file instantly.</p>
      </div>

      <GlassCard className="p-8">
        {!isGenerating ? (
          <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Repository URL</label>
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
              Generate Magic
            </button>
          </form>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#7C3AED] blur-2xl opacity-20 rounded-full animate-pulse" />
              <div className="w-20 h-20 bg-[#09090B] border border-white/10 rounded-2xl flex items-center justify-center relative z-10">
                <Sparkles className="w-10 h-10 text-[#22D3EE] animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-4 w-full max-w-sm">
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="space-y-2 text-left">
                {steps.map((s, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                    i < step ? "text-gray-500" : i === step ? "text-white font-medium" : "text-gray-600 opacity-50"
                  }`}>
                    {i < step ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : i === step ? (
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-4 h-4 rounded-full border-2 border-[#7C3AED] border-t-transparent"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/10" />
                    )}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
