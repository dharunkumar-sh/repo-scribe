"use client";

import { motion } from "framer-motion";

const technologies = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "Java", "Go", "Rust", "AI"
];

export default function Trusted() {
  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="container mx-auto px-6 mb-10">
        <p className="text-center text-sm font-medium text-[#A1A1AA] uppercase tracking-widest">
          Trusted by developers across <span className="text-[#FAFAFA]">1000+</span> Repositories
        </p>
      </div>
      
      {/* Marquee effect for tech badges */}
      <div className="flex whitespace-nowrap relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#09090B] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#09090B] to-transparent z-10" />
        
        <motion.div 
          className="flex gap-8 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, ease: "linear", repeat: Infinity }}
        >
          {/* Double the array for seamless looping */}
          {[...technologies, ...technologies].map((tech, idx) => (
            <div 
              key={idx} 
              className="px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center text-sm font-medium text-[#E4E4E7] hover:bg-white/10 hover:border-[#7C3AED]/50 transition-colors cursor-default"
            >
              {tech}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
