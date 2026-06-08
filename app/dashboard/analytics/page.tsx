"use client";

import { useGithubStore } from "@/store/useGithubStore";
import { GlassCard } from "../components/ui/GlassCard";
import { motion } from "framer-motion";
import { Activity, Code2, GitCommit, Users, GitPullRequest } from "lucide-react";
import { useMemo } from "react";

export default function GitHubAnalyticsPage() {
  const { repos, isConnected } = useGithubStore();

  // Mock Language Distribution
  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    repos.forEach(repo => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
        total++;
      }
    });

    return Object.entries(counts)
      .map(([lang, count]) => ({ lang, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [repos]);

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      TypeScript: "bg-[#3178C6]",
      JavaScript: "bg-[#F1E05A]",
      Python: "bg-[#3572A5]",
      Java: "bg-[#B07219]",
      Go: "bg-[#00ADD8]",
      Rust: "bg-[#DEA584]",
      CSS: "bg-[#563D7C]",
      HTML: "bg-[#E34C26]",
    };
    return colors[lang] || "bg-[#7C3AED]";
  };

  // Generate 365 mock days for the heatmap
  const mockHeatmap = Array.from({ length: 364 }).map(() => Math.floor(Math.random() * 5));

  if (!isConnected) {
    return (
      <div className="text-center py-20 text-gray-400">
        Please connect your GitHub account to view analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Contribution Analytics</h2>
        <p className="text-sm text-gray-400">Visualize your coding habits and repository growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap Section */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#22D3EE]" />
              Contribution Activity
            </h3>
            <span className="text-sm text-gray-400">Past Year</span>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide pb-4">
            <div className="flex gap-1" style={{ minWidth: "800px" }}>
              {/* Columns for weeks */}
              {Array.from({ length: 52 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {/* Rows for days */}
                  {mockHeatmap.slice(weekIndex * 7, (weekIndex + 1) * 7).map((level, dayIndex) => {
                    let colorClass = "bg-white/5"; // 0
                    if (level === 1) colorClass = "bg-[#7C3AED]/30";
                    if (level === 2) colorClass = "bg-[#7C3AED]/60";
                    if (level === 3) colorClass = "bg-[#7C3AED]/90";
                    if (level === 4) colorClass = "bg-[#7C3AED]";

                    return (
                      <div 
                        key={`${weekIndex}-${dayIndex}`} 
                        className={`w-3 h-3 rounded-sm ${colorClass} hover:ring-1 hover:ring-white transition-all cursor-pointer`}
                        title={`Activity level: ${level}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-400">Total Contributions</span>
                <span className="text-xl font-bold text-white">1,248</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-gray-400">Longest Streak</span>
                <span className="text-xl font-bold text-white">42 days</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              Less
              <div className="w-3 h-3 rounded-sm bg-white/5" />
              <div className="w-3 h-3 rounded-sm bg-[#7C3AED]/30" />
              <div className="w-3 h-3 rounded-sm bg-[#7C3AED]/60" />
              <div className="w-3 h-3 rounded-sm bg-[#7C3AED]/90" />
              <div className="w-3 h-3 rounded-sm bg-[#7C3AED]" />
              More
            </div>
          </div>
        </GlassCard>

        {/* Language Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Code2 className="w-5 h-5 text-[#A855F7]" />
            Languages
          </h3>
          
          {languageStats.length === 0 ? (
            <p className="text-sm text-gray-400">No language data available.</p>
          ) : (
            <div className="space-y-4">
              {/* Progress Bar visualization */}
              <div className="w-full h-3 rounded-full flex overflow-hidden mb-6">
                {languageStats.map((stat) => (
                  <div 
                    key={stat.lang} 
                    className={getLanguageColor(stat.lang)} 
                    style={{ width: `${stat.percentage}%` }}
                    title={`${stat.lang}: ${stat.percentage}%`}
                  />
                ))}
              </div>

              {/* List */}
              <div className="space-y-3">
                {languageStats.map((stat) => (
                  <div key={stat.lang} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getLanguageColor(stat.lang)}`} />
                      <span className="text-gray-300">{stat.lang}</span>
                    </div>
                    <span className="text-white font-medium">{stat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

      </div>
    </div>
  );
}
