"use client";

import { motion } from "framer-motion";
import { Link2, Cpu, FileText } from "lucide-react";

const steps = [
  {
    icon: <Link2 className="w-8 h-8 text-[#22D3EE]" />,
    title: "Paste Repository URL",
    description: "Simply add your public or private GitHub project link. No complex setup or configuration required.",
    step: "01",
    delay: 0.1,
  },
  {
    icon: <Cpu className="w-8 h-8 text-[#A855F7]" />,
    title: "AI Analysis",
    description: "Our advanced models instantly detect languages, frameworks, dependencies, and project structure.",
    step: "02",
    delay: 0.2,
  },
  {
    icon: <FileText className="w-8 h-8 text-[#7C3AED]" />,
    title: "Generate README",
    description: "Get a beautiful, production-ready documentation file customized perfectly for your codebase.",
    step: "03",
    delay: 0.3,
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            From Code to Documentation in <span className="text-gradient">Seconds</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg">
            Experience the fastest way to create professional READMEs. We've streamlined the entire process so you can focus on writing code.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: step.delay }}
              className="relative z-10 group"
            >
              <div className="h-full bg-[#09090B] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.02] transition-colors hover:border-white/20 shadow-lg hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                <div className="text-6xl font-black text-white/[0.03] absolute top-6 right-6 select-none group-hover:text-white/[0.05] transition-colors">
                  {step.step}
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold text-[#FAFAFA] mb-4 group-hover:text-[#22D3EE] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[#A1A1AA] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
