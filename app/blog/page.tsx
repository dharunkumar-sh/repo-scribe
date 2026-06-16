"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import Image from "next/image";

const featuredPost = {
  title: "Why Good Documentation Matters for Open-Source Project Adoption",
  excerpt: "A repository without clear documentation is practically invisible. Discover how a professional README can increase your GitHub stars, attract active contributors, and build trust in your packages.",
  category: "Engineering",
  date: "June 12, 2026",
  readTime: "5 min read",
  author: {
    name: "Alex Rivera",
    role: "DevRel Lead",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
};

const posts = [
  {
    title: "5 Ways to Make Your GitHub Profile Stand Out to Tech Recruiters",
    excerpt: "Recruiters scan dozens of profiles daily. Learn the structural and visual improvements that make your repositories instantly clear and compelling.",
    category: "Career",
    date: "June 8, 2026",
    readTime: "4 min read",
    author: {
      name: "Marcus Vance",
      role: "Technical Recruiter",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "How Generative AI is Changing Developer Documentation in 2026",
    excerpt: "No more stale wikis. Explore how autonomous agents and smart analysis parsers are keeping source code documentations synchronized on every commit.",
    category: "AI Technology",
    date: "May 28, 2026",
    readTime: "7 min read",
    author: {
      name: "Sophia Chen",
      role: "AI Scientist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Introducing the RepoScribe GitHub App: Automated Documentation",
    excerpt: "Say hello to continuous README updates. Learn how to configure and deploy our official GitHub App integrations to compile documentation on pull requests.",
    category: "Product Updates",
    date: "May 15, 2026",
    readTime: "3 min read",
    author: {
      name: "David Kim",
      role: "Lead Architect",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    },
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 relative">
        {/* Background visual element */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted">Dev Resources & Insights</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              The RepoScribe <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Guides, industry updates, and expert tips on how to document code, manage open-source projects, and design profiles.
            </p>
          </div>

          {/* Featured Post Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="glass rounded-[32px] border border-white/10 overflow-hidden shadow-2xl hover:border-white/20 transition-all group grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
              <div className="lg:col-span-7 relative h-72 lg:h-[420px] rounded-2xl overflow-hidden">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized
                />
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between py-2">
                <div className="space-y-4">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/20 text-accent border border-primary/20">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-accent transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <p className="text-white text-xs font-semibold">{featuredPost.author.name}</p>
                      <p className="text-gray-500 text-[10px]">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Secondary Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-white/20 transition-all flex flex-col justify-between group h-full cursor-pointer hover:scale-[1.01]"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 30vw"
                      unoptimized
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-accent border border-white/10">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/25"
                    />
                    <div>
                      <p className="text-white text-[10px] font-semibold">{post.author.name}</p>
                      <p className="text-gray-500 text-[8px]">{post.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
