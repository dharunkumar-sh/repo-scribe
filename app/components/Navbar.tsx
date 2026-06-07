"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        scrolled ? "glass border-white/10 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.8)] transition-shadow">
            R
          </div>
          <span className="font-bold text-xl tracking-tight text-[#FAFAFA]">RepoScribe</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A1A1AA]">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#templates" className="hover:text-white transition-colors">Templates</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <button className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Code2 className="w-4 h-4" />
            Get Started
          </button>
        </div>
      </div>
    </motion.header>
  );
}
