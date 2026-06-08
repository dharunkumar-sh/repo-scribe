"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Settings,
  Sparkles,
  FolderDot,
  LayoutDashboard,
  LayoutTemplate,
  History,
  FolderHeart,
  Star,
  BarChart3,
  BookMarked,
  FileCode2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useGithubStore } from "@/store/useGithubStore";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";

const FEATURES = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "Navigation" },
  { label: "Generate README", href: "/dashboard/generate", icon: Sparkles, category: "Navigation" },
  { label: "My Projects", href: "/dashboard/projects", icon: FolderDot, category: "Navigation" },
  { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate, category: "Navigation" },
  { label: "History", href: "/dashboard/history", icon: History, category: "Navigation" },
  { label: "Collections", href: "/dashboard/collections", icon: FolderHeart, category: "Navigation" },
  { label: "Favorites", href: "/dashboard/favorites", icon: Star, category: "Navigation" },
  { label: "GitHub Profile Manager", href: "/dashboard/github", icon: GithubIcon, category: "GitHub Workspace" },
  { label: "Repository Manager", href: "/dashboard/repositories", icon: BookMarked, category: "GitHub Workspace" },
  { label: "Contribution Analytics", href: "/dashboard/analytics", icon: BarChart3, category: "GitHub Workspace" },
  { label: "Profile README Generator", href: "/dashboard/readme", icon: FileCode2, category: "GitHub Workspace" },
  { label: "Account Settings", href: "/dashboard/settings", icon: Settings, category: "Settings" },
];

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, toggleCommandPalette } = useDashboardStore();
  const { repos, isConnected } = useGithubStore();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter and build combined list
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Filter static features
    const matchedFeatures = FEATURES.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );

    // 2. Filter repositories
    const matchedRepos = isConnected
      ? repos
          .filter(
            (repo) =>
              repo.name.toLowerCase().includes(q) ||
              (repo.description && repo.description.toLowerCase().includes(q))
          )
          .map((repo) => ({
            label: repo.name,
            href: repo.html_url,
            isExternal: true,
            icon: FolderDot,
            category: "GitHub Repositories",
            subtitle: repo.description || repo.language || "GitHub Repository",
          }))
      : [];

    return [...matchedFeatures, ...matchedRepos];
  }, [searchQuery, repos, isConnected]);

  const handleSelect = (item: any) => {
    if (item.isExternal) {
      window.open(item.href, "_blank", "noreferrer");
    } else {
      router.push(item.href);
    }
    setCommandPaletteOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }

      if (!isCommandPaletteOpen) return;

      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, toggleCommandPalette, setCommandPaletteOpen, filteredItems, selectedIndex]);

  // Group items by category for rendering while preserving flat index tracking
  const groupedItems = useMemo(() => {
    const groups: Record<string, { item: any; globalIndex: number }[]> = {};
    filteredItems.forEach((item, globalIndex) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push({ item, globalIndex });
    });
    return groups;
  }, [filteredItems]);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-xl bg-[#09090B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto shadow-[0_0_50px_rgba(124,58,237,0.2)]"
            >
              {/* Search Box */}
              <div className="flex items-center px-4 py-4 border-b border-white/5 bg-white/[0.02]">
                <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repositories, pages, settings..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 text-sm"
                />
                <kbd className="bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-gray-400 font-mono ml-3">ESC</kbd>
              </div>

              {/* Suggestions list */}
              <div className="p-3 max-h-[60vh] overflow-y-auto scrollbar-hide flex flex-col gap-4">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No results found for &ldquo;<span className="text-white font-medium">{searchQuery}</span>&rdquo;
                  </div>
                ) : (
                  Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="flex flex-col gap-1">
                      <div className="px-3 py-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{category}</div>
                      {items.map(({ item, globalIndex }) => {
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = item.icon;
                        return (
                          <button
                            key={globalIndex}
                            onClick={() => handleSelect(item)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all text-left w-full group relative ${
                              isSelected
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-gray-400 hover:bg-white/[0.03] hover:text-white"
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg shrink-0 ${
                              isSelected ? "bg-[#7C3AED] text-white" : "bg-white/5 text-gray-400 group-hover:text-white"
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{item.label}</div>
                              {item.subtitle && (
                                <div className={`text-xs truncate mt-0.5 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                                  {item.subtitle}
                                </div>
                              )}
                            </div>
                            {item.isExternal ? (
                              <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white shrink-0" />
                            ) : (
                              <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${
                                isSelected ? "translate-x-0.5 text-white" : "group-hover:translate-x-0.5"
                              }`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer info bar */}
              <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <div className="flex items-center gap-3">
                  <span>Use <kbd className="bg-white/5 border border-white/10 px-1 rounded">↑↓</kbd> to navigate</span>
                  <span><kbd className="bg-white/5 border border-white/10 px-1 rounded">Enter</kbd> to select</span>
                </div>
                <span>{filteredItems.length} results</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
