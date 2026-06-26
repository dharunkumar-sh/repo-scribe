"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useGithubStore } from "@/store/useGithubStore";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import {
  LayoutDashboard,
  Sparkles,
  LayoutTemplate,
  FolderHeart,
  Star,
  BarChart3,
  User as UserIcon,
  LogOut,
  BookMarked,
  Lock,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Generate README", href: "/dashboard/generate", icon: Sparkles, accent: true },
  { name: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
  { name: "Collections", href: "/dashboard/collections", icon: FolderHeart },
  { name: "Favourites", href: "/dashboard/favorites", icon: Star },
];

const secondaryNavigation = [
  { name: "GitHub Profile Manager", href: "/dashboard/github", icon: GithubIcon },
  { name: "Repositories", href: "/dashboard/repositories", icon: BookMarked },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },

];

const GITHUB_GATED = ["Repositories", "Analytics"];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isConnected: isGithubConnected } = useGithubStore();

  const NavItem = ({ item, layoutGroup }: { item: any; layoutGroup: string }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    const isDisabled = GITHUB_GATED.includes(item.name) && !isGithubConnected;

    if (isDisabled) {
      return (
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 cursor-not-allowed select-none relative group"
          title="Connect GitHub to unlock this section"
        >
          <item.icon className="w-5 h-5 shrink-0 text-gray-700" />
          <span className="whitespace-nowrap overflow-hidden flex-1 text-sm">
            {item.name}
          </span>
          <Lock className="w-3 h-3 text-gray-700 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      );
    }

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative text-sm",
          isActive
            ? "bg-white/10 text-white font-medium"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}
      >
        {isActive && (
          <motion.div
            layoutId={`sidebar-active-${layoutGroup}`}
            className="absolute left-0 w-0.5 h-5 bg-[#7C3AED] rounded-r-full"
            initial={{ opacity: 0, scaleY: 0.5 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.5 }}
            transition={{ duration: 0.2 }}
          />
        )}
        <item.icon
          className={cn(
            "w-5 h-5 shrink-0 transition-colors",
            isActive
              ? item.accent ? "text-[#22D3EE]" : "text-white"
              : item.accent ? "text-[#22D3EE]/70 group-hover:text-[#22D3EE]" : ""
          )}
        />
        <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="w-65 h-screen bg-[#09090B] border-r border-white/5 flex flex-col z-50 shrink-0 sticky top-0">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="RepoScribe Logo" width={36} height={36} className="shrink-0" />
          <span className="font-bold text-lg tracking-tight overflow-hidden whitespace-nowrap text-white">
            RepoScribe AI
          </span>
        </div>
      </div>

      {/* Navigation Areas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-4 px-3 flex flex-col gap-6">
        {/* Primary nav */}
        <div className="flex flex-col gap-0.5">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} layoutGroup="primary" />
          ))}
        </div>

        {/* Secondary nav */}
        <div className="flex flex-col gap-0.5">
          <div className="px-3 text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">
            Workspace
          </div>
          {secondaryNavigation.map((item) => (
            <NavItem key={item.name} item={item} layoutGroup="secondary" />
          ))}
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate leading-tight">
              {user?.displayName || user?.email?.split("@")[0] || "User"}
            </div>
            <div className="text-[11px] text-gray-500 truncate leading-tight">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-gray-600 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
