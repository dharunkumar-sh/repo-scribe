"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Speed", manual: "Hours or Days", manualNegative: true, scribe: "Under 10 seconds", scribePositive: true },
  { feature: "Quality", manual: "Inconsistent", manualNegative: true, scribe: "Professional & Standardized", scribePositive: true },
  { feature: "Automation", manual: "Fully Manual", manualNegative: true, scribe: "100% Automated", scribePositive: true },
  { feature: "Customization", manual: "Requires markdown skills", manualNegative: true, scribe: "One-click templates", scribePositive: true },
  { feature: "Ease of Use", manual: "Tedious & Boring", manualNegative: true, scribe: "Effortless & Fun", scribePositive: true },
];

export default function Comparison() {
  return (
    <section className="py-32 bg-[#09090B]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-gradient">RepoScribe?</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg">
            Stop wasting hours writing boilerplate documentation. See how we compare to the traditional workflow.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-white/5 border-b border-white/10">
              <div className="p-6 font-semibold text-[#FAFAFA]">Feature</div>
              <div className="p-6 font-semibold text-[#A1A1AA] border-l border-white/10 text-center">Manual Documentation</div>
              <div className="p-6 font-bold text-[#22D3EE] border-l border-white/10 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 to-[#22D3EE]/20 opacity-50" />
                <span className="relative z-10 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] text-white flex items-center justify-center text-xs">R</div>
                  RepoScribe
                </span>
              </div>
            </div>

            {/* Table Body */}
            <div>
              {comparisons.map((row, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="p-6 flex items-center text-[#E4E4E7] font-medium">
                    {row.feature}
                  </div>
                  <div className="p-6 border-l border-white/10 flex items-center justify-center gap-2 text-center text-sm">
                    {row.manualNegative ? <X className="w-4 h-4 text-red-400" /> : <Check className="w-4 h-4 text-green-400" />}
                    <span className="text-[#A1A1AA]">{row.manual}</span>
                  </div>
                  <div className="p-6 border-l border-white/10 flex items-center justify-center gap-2 text-center text-sm relative bg-[#7C3AED]/5">
                    {row.scribePositive ? <Check className="w-5 h-5 text-[#22D3EE]" /> : <X className="w-4 h-4 text-red-400" />}
                    <span className="text-[#FAFAFA] font-semibold">{row.scribe}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
