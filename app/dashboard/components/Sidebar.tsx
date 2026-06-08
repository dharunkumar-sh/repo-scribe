"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuth } from "@/context/AuthContext";
import { useGithubStore } from "@/store/useGithubStore";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import {
  LayoutDashboard,
  Sparkles,
  FolderDot,
  LayoutTemplate,
  History,
  FolderHeart,
  Star,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  LogOut,
  BookMarked,
  FileCode2,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Generate README", href: "/dashboard/generate", icon: Sparkles, accent: true },
  { name: "My Projects", href: "/dashboard/projects", icon: FolderDot },
  { name: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Collections", href: "/dashboard/collections", icon: FolderHeart },
  { name: "Favorites", href: "/dashboard/favorites", icon: Star },
];

const secondaryNavigation = [
  { name: "GitHub Profile Manager", href: "/dashboard/github", icon: GithubIcon },
  { name: "Repositories", href: "/dashboard/repositories", icon: BookMarked },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Profile README", href: "/dashboard/readme", icon: FileCode2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useDashboardStore();
  const { user, logout } = useAuth();
  const { isConnected: isGithubConnected } = useGithubStore();

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    const isDisabled = ["Repositories", "Analytics", "Profile README"].includes(item.name) && !isGithubConnected;

    if (isDisabled) {
      return (
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 cursor-not-allowed select-none relative"
          title={`Connect GitHub to access ${item.name}`}
        >
          <item.icon className="w-5 h-5 shrink-0 text-gray-600" />
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
          isActive 
            ? "bg-white/10 text-white" 
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 w-1 h-6 bg-[#7C3AED] rounded-r-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        <item.icon className={cn("w-5 h-5 shrink-0", item.accent && "text-[#22D3EE]")} />
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isSidebarOpen ? 280 : 80 }}
      className="h-screen bg-[#09090B] border-r border-white/5 flex flex-col z-50 shrink-0 sticky top-0"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#7C3AED] to-[#22D3EE] flex items-center justify-center shrink-0">
                <span className="text-white text-sm">RS</span>
              </div>
              RepoScribe
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 mx-auto" />}
        </button>
      </div>

      {/* Navigation Areas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-4 px-3 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {isSidebarOpen && <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Workspace</div>}
          {secondaryNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/5 shrink-0 flex flex-col gap-4">
        <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
            {user?.photoURL ? (
              <Image src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.displayName || user?.email?.split("@")[0] || 'User'}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          )}
          {isSidebarOpen && (
            <button onClick={logout} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
