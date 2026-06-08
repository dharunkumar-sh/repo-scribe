"use client";

import { useState, useMemo } from "react";
import { useGithubStore } from "@/store/useGithubStore";
import { RepositoryCard } from "../components/ui/RepositoryCard";
import { Search, Filter, SortDesc } from "lucide-react";
import { motion } from "framer-motion";

export default function GitHubRepositoriesPage() {
  const { repos, isConnected } = useGithubStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"updated" | "stars" | "name">("updated");

  const filteredAndSortedRepos = useMemo(() => {
    let result = repos.filter(repo => 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    result.sort((a, b) => {
      if (sortOption === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortOption === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return result;
  }, [repos, searchQuery, sortOption]);

  // Mock health score calculation based on some factors
  const calculateHealthScore = (repo: any) => {
    let score = 50; // base score
    if (repo.description) score += 15;
    if (repo.has_wiki || repo.has_pages) score += 10;
    if (repo.topics && repo.topics.length > 0) score += 15;
    if (repo.license) score += 10;
    return score;
  };

  if (!isConnected) {
    return (
      <div className="text-center py-20 text-gray-400">
        Please connect your GitHub account in the Overview tab to view repositories.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Repository Manager</h2>
          <p className="text-sm text-gray-400">Analyze health and manage your GitHub repositories.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search repositories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#7C3AED] transition-colors appearance-none cursor-pointer"
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSortedRepos.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <p className="text-gray-400">No repositories found matching your search.</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAndSortedRepos.map((repo, idx) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <RepositoryCard repo={repo} healthScore={calculateHealthScore(repo)} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
