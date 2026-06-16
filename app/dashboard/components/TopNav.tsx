"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, Clock, Star, FileText, GitMerge, FileCode2, Activity } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useHistory } from "@/context/HistoryContext";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

function getActivityIcon(type: string) {
  switch (type) {
    case "generate":
      return <FileCode2 className="w-4 h-4 text-purple-400" />;
    case "github_connect":
      return <GithubIcon className="w-4 h-4 text-cyan-400" />;
    case "edit_template":
      return <FileText className="w-4 h-4 text-emerald-400" />;
    case "collection_add":
      return <GitMerge className="w-4 h-4 text-blue-400" />;
    case "favourite":
      return <Star className="w-4 h-4 text-yellow-400 fill-current" />;
    default:
      return <Activity className="w-4 h-4 text-gray-400" />;
  }
}

export function TopNav() {
  const { toggleCommandPalette } = useDashboardStore();
  const { activities, loading } = useHistory();
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [prevLatestActivityId, setPrevLatestActivityId] = useState<string | null>(null);

  const latestActivityId = activities[0]?.id || null;
  if (latestActivityId !== prevLatestActivityId) {
    setPrevLatestActivityId(latestActivityId);
    if (latestActivityId && !isNotificationsOpen) {
      setHasUnread(true);
    }
  }

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    setIsNotificationsOpen((prev) => {
      if (!prev) {
        setHasUnread(false);
      }
      return !prev;
    });
  };

  const handleClearNotifications = () => {
    setHasUnread(false);
    setIsNotificationsOpen(false);
  };

  const recentNotifications = activities.slice(0, 5);

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
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-2">
          <button
            ref={triggerRef}
            onClick={handleToggleNotifications}
            className={`p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative ${
              isNotificationsOpen ? "bg-white/5 text-white" : ""
            }`}
          >
            <Bell className="w-5 h-5" />
            {hasUnread && activities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
            )}
          </button>
        </div>

        {/* Notifications Dropdown Panel */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 bg-[#09090B]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 text-white overflow-hidden pointer-events-auto"
            >
              {/* Top gradient indicator */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE]" />

              <div className="p-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Activity Feed</span>
                    {activities.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#7C3AED]/20 text-[#A855F7] rounded-full text-[10px] font-bold">
                        {activities.length}
                      </span>
                    )}
                  </div>
                  {activities.length > 0 && (
                    <button
                      onClick={handleClearNotifications}
                      className="text-xs text-gray-400 hover:text-white transition-colors font-medium"
                    >
                      Clear badge
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {loading ? (
                    <div className="flex justify-center py-6">
                      <div className="w-5 h-5 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : recentNotifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-xs">
                      No recent activities.
                    </div>
                  ) : (
                    recentNotifications.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex gap-3 text-xs leading-normal p-2.5 rounded-xl hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/5"
                      >
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-200 font-medium break-words">{activity.title}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500 font-medium">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {activity.createdAt
                                ? formatDistanceToNow(activity.createdAt.toDate(), { addSuffix: true })
                                : "Just now"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
