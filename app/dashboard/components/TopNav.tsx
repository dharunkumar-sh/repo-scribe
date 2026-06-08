"use client";

import { Search, Bell, Command } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

export function TopNav() {
  const { toggleCommandPalette } = useDashboardStore();

  return (
    <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Search Bar Hint */}
      <div className="flex-1 flex items-center">
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-sm text-gray-400 transition-all w-64 group"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search anything...</span>
          <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
            <kbd className="bg-black/50 px-1.5 py-0.5 rounded text-[10px] font-sans flex items-center gap-1 border border-white/10">
              <Command className="w-3 h-3" />K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
