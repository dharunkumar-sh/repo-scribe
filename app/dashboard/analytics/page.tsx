"use client";

import { useGithubStore } from "@/store/useGithubStore";
import { GlassCard } from "../components/ui/GlassCard";
import { motion } from "framer-motion";
import { Activity, Code2, GitCommit, Users, GitPullRequest, Star, GitFork } from "lucide-react";
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

  const topRepos = useMemo(() => {
    return [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);
  }, [repos]);

  const totalStars = useMemo(() => repos.reduce((acc, repo) => acc + repo.stargazers_count, 0), [repos]);
  const totalForks = useMemo(() => repos.reduce((acc, repo) => acc + repo.forks_count, 0), [repos]);

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
  const mockHeatmap = Array.from({ length: 364 }).map(() => {
    const rand = Math.random();
    if (rand > 0.8) return Math.floor(Math.random() * 3) + 2;
    if (rand > 0.4) return 1;
    return 0;
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Activity className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Analytics Available</h2>
        <p className="text-gray-400 max-w-md">
          Please connect your GitHub account to visualize your coding habits, repository growth, and language usage.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Contribution Analytics</h2>
        <p className="text-sm text-gray-400">Visualize your coding habits and repository growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2 text-gray-400">
            <GitCommit className="w-5 h-5 text-[#22D3EE]" />
            <span className="font-medium">Total Commits (Est)</span>
          </div>
          <div className="text-3xl font-bold text-white">1,248</div>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2 text-gray-400">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Total Stars Earned</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalStars}</div>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2 text-gray-400">
            <GitFork className="w-5 h-5 text-green-500" />
            <span className="font-medium">Total Forks</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalForks}</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Section */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#22D3EE]" />
              Contribution Activity
            </h3>
            <span className="text-sm text-gray-400 border border-white/10 px-3 py-1 rounded-full bg-white/5">Past Year</span>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide pb-4">
            <div className="flex gap-[3px]" style={{ minWidth: "800px" }}>
              {/* Columns for weeks */}
              {Array.from({ length: 52 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {/* Rows for days */}
                  {mockHeatmap.slice(weekIndex * 7, (weekIndex + 1) * 7).map((level, dayIndex) => {
                    let colorClass = "bg-white/5"; // 0
                    if (level === 1) colorClass = "bg-[#7C3AED]/30";
                    if (level === 2) colorClass = "bg-[#7C3AED]/60";
                    if (level === 3) colorClass = "bg-[#7C3AED]/90";
                    if (level >= 4) colorClass = "bg-[#7C3AED]";

                    return (
                      <div 
                        key={`${weekIndex}-${dayIndex}`} 
                        className={`w-3.5 h-3.5 rounded-[2px] ${colorClass} hover:ring-1 hover:ring-white transition-all cursor-pointer`}
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
                <span className="text-gray-400">Longest Streak</span>
                <span className="text-xl font-bold text-white">42 days</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              Less
              <div className="w-3.5 h-3.5 rounded-[2px] bg-white/5" />
              <div className="w-3.5 h-3.5 rounded-[2px] bg-[#7C3AED]/30" />
              <div className="w-3.5 h-3.5 rounded-[2px] bg-[#7C3AED]/60" />
              <div className="w-3.5 h-3.5 rounded-[2px] bg-[#7C3AED]/90" />
              <div className="w-3.5 h-3.5 rounded-[2px] bg-[#7C3AED]" />
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
            <p className="text-sm text-gray-400 py-8 text-center bg-white/5 rounded-xl border border-white/5">No language data available.</p>
          ) : (
            <div className="space-y-4">
              {/* Progress Bar visualization */}
              <div className="w-full h-3 rounded-full flex overflow-hidden mb-6 shadow-inner bg-black/50">
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
                  <div key={stat.lang} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full shadow-sm ${getLanguageColor(stat.lang)}`} />
                      <span className="text-gray-300 font-medium">{stat.lang}</span>
                    </div>
                    <span className="text-white bg-white/10 px-2 py-0.5 rounded text-xs font-semibold">{stat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Top Repositories */}
        {topRepos.length > 0 && (
          <GlassCard className="p-6 lg:col-span-3">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-500" />
              Top Starred Repositories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRepos.map((repo) => (
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" key={repo.id} className="block group">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all h-full flex flex-col">
                    <h4 className="font-medium text-[#22D3EE] group-hover:text-white transition-colors truncate mb-1">
                      {repo.name}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                      {repo.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        {repo.language && (
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                            {repo.language}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {repo.stargazers_count}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
