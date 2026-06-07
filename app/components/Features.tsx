"use client";

import { motion } from "framer-motion";
import { 
  Brain, Layout, Eye, ShieldCheck, 
  Copy, Download, Moon, Zap, 
  Code2, Layers 
} from "lucide-react";

const features = [
  { icon: <Brain className="w-6 h-6" />, title: "Smart Repository Analysis", description: "Deep scanning of your codebase to understand intent, structure, and dependencies." },
  { icon: <Zap className="w-6 h-6" />, title: "Fast Generation", description: "Get a comprehensive README in less than 10 seconds, saving hours of writing." },
  { icon: <Layout className="w-6 h-6" />, title: "Multiple Templates", description: "Choose from Professional, Minimal, Open Source, and Portfolio layouts." },
  { icon: <Eye className="w-6 h-6" />, title: "Live Markdown Preview", description: "See exactly how your README will look on GitHub before you export." },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Automatic Badges", description: "Auto-detects and inserts beautiful shields.io badges for your tech stack." },
  { icon: <Code2 className="w-6 h-6" />, title: "GitHub Ready", description: "100% compliant with GitHub Flavored Markdown (GFM) standards." },
  { icon: <Copy className="w-6 h-6" />, title: "One Click Copy", description: "Instantly copy the generated markdown to your clipboard." },
  { icon: <Download className="w-6 h-6" />, title: "Download README.md", description: "Export directly as a .md file ready to be committed to your repository." },
  { icon: <Moon className="w-6 h-6" />, title: "Dark Mode Support", description: "Designed for developers with a stunning dark mode interface." },
  { icon: <Layers className="w-6 h-6" />, title: "Custom Sections", description: "Easily toggle Installation, Usage, API, and Contributing sections." },
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-white/[0.01]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything You Need for <span className="text-gradient">Perfect Documentation</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg">
            A comprehensive suite of tools designed to make creating and managing your project's documentation effortless.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group p-6 rounded-2xl bg-[#09090B] border border-white/5 hover:border-[#7C3AED]/30 hover:bg-white/[0.02] transition-all hover:-translate-y-1 shadow-sm hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center mb-6 text-[#A1A1AA] group-hover:text-[#A855F7] group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed group-hover:text-[#D4D4D8] transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
