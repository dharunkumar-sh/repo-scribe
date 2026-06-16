"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const templates = [
  { name: "Professional", color: "from-blue-500/20 to-cyan-500/20", border: "hover:border-cyan-500/50" },
  { name: "Open Source", color: "from-green-500/20 to-emerald-500/20", border: "hover:border-emerald-500/50" },
  { name: "Portfolio", color: "from-purple-500/20 to-pink-500/20", border: "hover:border-pink-500/50" },
  { name: "Hackathon", color: "from-orange-500/20 to-red-500/20", border: "hover:border-orange-500/50" },
  { name: "Startup", color: "from-indigo-500/20 to-violet-500/20", border: "hover:border-indigo-500/50" },
  { name: "Minimal", color: "from-gray-500/20 to-slate-500/20", border: "hover:border-gray-500/50" },
];

export default function Templates() {
  return (
    <section id="templates" className="py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              50+ Templates for <span className="text-gradient">Every Project</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg">
              Start with a beautifully crafted foundation. Whether you are building an open-source library or a commercial SaaS, we have a layout that fits perfectly.
            </p>
          </div>
          <button className="text-[#FAFAFA] font-medium flex items-center gap-2 hover:text-[#22D3EE] transition-colors group">
            <Sparkles className="w-4 h-4 text-[#A855F7] group-hover:text-[#22D3EE] transition-colors" />
            Explore all templates
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group cursor-pointer rounded-2xl bg-[#09090B] border border-white/10 p-2 transition-all duration-300 ${template.border} hover:shadow-2xl`}
            >
              <div className={`w-full h-48 rounded-xl bg-gradient-to-br ${template.color} relative overflow-hidden mb-4`}>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                {/* Mock skeleton for template preview */}
                <div className="absolute top-4 left-4 right-4 bottom-4 flex flex-col gap-3 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-1/3 h-6 bg-white/20 rounded-md" />
                  <div className="flex gap-2">
                    <div className="w-16 h-4 bg-white/10 rounded" />
                    <div className="w-16 h-4 bg-white/10 rounded" />
                  </div>
                  <div className="w-full h-16 bg-white/5 rounded-md mt-2" />
                  <div className="w-2/3 h-4 bg-white/10 rounded mt-auto" />
                </div>
              </div>
              <div className="px-4 pb-4">
                <h3 className="font-semibold text-lg text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                  {template.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
