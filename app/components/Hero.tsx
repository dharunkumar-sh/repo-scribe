"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Terminal } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const handleActionClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      openAuthModal();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C3AED]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#22D3EE]/20 rounded-full blur-[100px] mix-blend-screen" style={{ animation: 'pulse 4s infinite alternate' }} />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-[#22D3EE]" />
            <span className="text-sm font-medium text-[#E4E4E7]">RepoScribe AI is now live</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Turn Any GitHub Repository Into a <span className="text-gradient">Stunning README.</span>
          </h1>
          
          <p className="text-lg text-[#A1A1AA] mb-10 max-w-xl leading-relaxed">
            Paste your GitHub repository URL and let AI analyze your project to generate a polished, professional README in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleActionClick}
              className="bg-linear-to-r from-accent-400 to-accent-200 hover:from-accent-600 hover:to-accent-200 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] cursor-pointer"
            >
              {user ? "Go to Dashboard" : "Generate README"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Main Terminal/Preview Window */}
          <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
            <div className="bg-black/50 px-4 py-3 flex items-center gap-2 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 text-center text-xs text-[#A1A1AA] font-mono">
                reposcribe-ai-preview
              </div>
            </div>
            
            <div className="p-6 bg-[#09090B]/80 font-mono text-sm">
              <div className="flex items-center gap-3 mb-6 bg-white/5 rounded-lg p-3 border border-white/10">
                <Terminal className="w-5 h-5 text-[#22D3EE]" />
                <span className="text-[#FAFAFA]">https://github.com/username/awesome-project</span>
                <div className="ml-auto w-2 h-4 bg-[#7C3AED] animate-pulse" />
              </div>
              
              <div className="space-y-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                  className="flex items-center gap-2 text-[#A1A1AA]"
                >
                  <span className="text-[#A855F7]">{">"}</span> Analyzing repository structure...
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                  className="flex items-center gap-2 text-[#A1A1AA]"
                >
                  <span className="text-[#A855F7]">{">"}</span> Detecting frameworks: <span className="text-[#22D3EE]">React, Next.js, Tailwind</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}
                  className="flex items-center gap-2 text-[#A1A1AA]"
                >
                  <span className="text-[#A855F7]">{">"}</span> Generating documentation...
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
                  className="flex items-center gap-2 text-green-400 mt-4"
                >
                  <Sparkles className="w-4 h-4" /> README.md successfully generated!
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Floating Badges */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-8 -right-8 glass px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl z-20"
          >
            <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] font-bold">TS</div>
            <span className="font-semibold text-sm">TypeScript Detected</span>
          </motion.div>
          
          <motion.div 
            animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-8 glass px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl z-20"
          >
            <div className="w-8 h-8 rounded-full bg-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE] font-bold">R</div>
            <span className="font-semibold text-sm">React Components</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
