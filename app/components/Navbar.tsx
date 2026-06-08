"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Code2, User, Settings, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, openAuthModal, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent-400 to-accent-200 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.8)] transition-shadow">
            R
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            RepoScribe
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground">
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link
            href="#templates"
            className="hover:text-white transition-colors"
          >
            Templates
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How It Works
          </Link>
          <Link href="#faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-4 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full border border-white/20 overflow-hidden flex items-center justify-center bg-white/5 hover:border-primary transition-colors cursor-pointer"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {user.email?.[0].toUpperCase() || "U"}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-sm font-medium text-white truncate">
                        {user.displayName || user.email?.split("@")[0] || "Developer"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    <button className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </button>

                    <div className="h-px bg-white/5 my-2" />

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              Get Started
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
