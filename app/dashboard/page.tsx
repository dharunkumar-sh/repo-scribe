"use client";

import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "./components/ui/GlassCard";
import { AnimatedStat } from "./components/ui/AnimatedStat";
import { Badge } from "./components/ui/Badge";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import { Upload, FileText, ArrowRight, Clock, Star, GitMerge, FileCode2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const quickActions = [
  {
    title: "Generate from GitHub",
    description: "Paste a URL and let AI do the rest.",
    icon: GithubIcon,
    color: "from-[#7C3AED] to-[#A855F7]",
    href: "/dashboard/generate",
  },
  {
    title: "Import Repository",
    description: "Connect and sync your repositories.",
    icon: GitMerge,
    color: "from-[#22D3EE] to-[#3B82F6]",
    href: "/dashboard/projects",
  },
  {
    title: "Upload Project ZIP",
    description: "Generate READMEs from local files.",
    icon: Upload,
    color: "from-[#F59E0B] to-[#EF4444]",
    href: "/dashboard/upload",
  },
  {
    title: "Browse Templates",
    description: "Start with a professionally designed layout.",
    icon: FileText,
    color: "from-[#10B981] to-[#059669]",
    href: "/dashboard/templates",
  },
];

const recentActivity = [
  {
    title: "Generated README for repo-scribe",
    time: "2 hours ago",
    icon: FileCode2,
    status: "success",
  },
  {
    title: "Connected GitHub Account",
    time: "5 hours ago",
    icon: GithubIcon,
    status: "default",
  },
  {
    title: "Edited 'Startup Template'",
    time: "Yesterday",
    icon: FileText,
    status: "accent",
  },
  {
    title: "Starred 'Open Source Template'",
    time: "2 days ago",
    icon: Star,
    status: "warning",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Developer";

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Good Evening, <span className="text-gradient">{firstName}.</span>
          </h1>
          <p className="text-gray-400 text-lg">Ready to document your next project?</p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/dashboard/generate" className="px-5 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" />
            New README
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <AnimatedStat value={12} label="Repositories Processed" />
        </GlassCard>
        <GlassCard className="p-6">
          <AnimatedStat value={47} label="READMEs Generated" />
        </GlassCard>
        <GlassCard className="p-6">
          <AnimatedStat value={3} label="GitHub Connected" />
        </GlassCard>
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#22D3EE]/20 rounded-full blur-xl pointer-events-none" />
          <AnimatedStat value={850} label="AI Credits Remaining" />
        </GlassCard>
      </motion.div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link href={action.href} key={index}>
                <GlassCard hoverEffect className="p-5 h-full group flex flex-col cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} p-[1px] mb-4`}>
                    <div className="w-full h-full bg-[#09090B] rounded-lg flex items-center justify-center">
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-medium text-white mb-1 group-hover:text-[#7C3AED] transition-colors">{action.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 flex-1">{action.description}</p>
                  <div className="flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                    Get started <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Link href="/dashboard/history" className="text-sm text-[#7C3AED] hover:text-[#A855F7] transition-colors">View all</Link>
          </div>
          <GlassCard className="p-5">
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-4 relative">
                  {index !== recentActivity.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-white/10" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10">
                    <activity.icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      <Badge variant={activity.status as any} className="ml-2 scale-90 origin-left">
                        {activity.status === 'default' ? 'info' : activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
