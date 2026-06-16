"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Shield, Sparkles, Zap, Heart } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Instant Speed",
    description: "Convert a full GitHub repository into a readable, beautiful README in less than 10 seconds.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Code Security",
    description: "We only request read-only permissions for public metadata. Your private IP is safe with us.",
    color: "from-blue-400 to-indigo-600",
  },
  {
    icon: Sparkles,
    title: "Premium Design",
    description: "Standardized templates created by design experts to make your repository look extremely polished.",
    color: "from-pink-500 to-purple-600",
  },
  {
    icon: Heart,
    title: "Developer First",
    description: "Built for developers, by developers. We focus on removing friction from the open-source pipeline.",
    color: "from-emerald-400 to-teal-600",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 relative">
        {/* Decorative background gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted">Our Mission</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight text-white"
            >
              We make code <span className="text-gradient">documentation effortless.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              RepoScribe AI was founded in 2026 with a simple goal: to help developers focus on writing code instead of writing boilerplate Markdown files. We leverage state-of-the-art Large Language Models to analyze repository structure, extract dependency trees, and generate professional README.md documentation instantly.
            </motion.p>
          </div>

          {/* Core Values Section */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-center text-white mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((val, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-8 rounded-3xl border border-white/10 flex gap-6 hover:border-white/20 transition-all hover:scale-[1.02] group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${val.color} p-[1px] shrink-0`}>
                    <div className="w-full h-full bg-[#09090B] rounded-2xl flex items-center justify-center">
                      <val.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-accent transition-colors">
                      {val.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <h2 className="text-3xl font-bold text-white mb-6 relative z-10">The RepoScribe Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">
              As developers, we built hundreds of side projects and open-source libraries. Each time, we dreaded writing the `README.md`. We noticed that many outstanding repositories got ignored simply because their documentation failed to communicate their value.
            </p>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              We asked ourselves: why can't AI handle this? By connecting to the repository structure and analyzing the codebase, our custom intelligence parser maps out the file layout, automatically detects libraries and build scripts, and synthesizes them into standard, polished formats. Today, RepoScribe powers documentation for thousands of active developers, making open source readable and accessible.
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
