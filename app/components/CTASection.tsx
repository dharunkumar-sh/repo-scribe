"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated massive gradient background */}
      <div className="absolute inset-0 bg-[#09090B]">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#22D3EE] rounded-[100%] blur-[120px] opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass max-w-5xl mx-auto rounded-3xl border border-white/20 p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Ready to Make Your GitHub <br className="hidden md:block"/> Stand Out?
            </h2>
            <p className="text-xl text-[#E4E4E7] mb-10 max-w-2xl mx-auto">
              Join thousands of developers who are generating beautiful AI-powered READMEs in seconds.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Generate README
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-[#22D3EE]" />
                Explore Templates
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
