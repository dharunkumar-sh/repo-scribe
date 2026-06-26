"use client";

import { useState, useMemo, useEffect } from "react";
import { useGithubStore } from "@/store/useGithubStore";
import { RepositoryCard } from "../components/ui/RepositoryCard";
import { CustomSelect } from "../components/ui/CustomSelect";
import { Search, Filter, SortDesc, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { fetchGithubRepos, GithubRepo } from "@/lib/github";
import { toast } from "react-hot-toast";

export default function GitHubRepositoriesPage() {
  const { repos, isConnected, token, setRepos } = useGithubStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"updated" | "stars" | "name">("updated");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async (signal?: AbortSignal) => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const reposData = await fetchGithubRepos(token, signal);
      setRepos(reposData);
      toast.success("Repositories synced successfully!");
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      toast.error("Failed to sync repositories.");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isConnected && token && repos.length === 0) {
      const controller = new AbortController();
      handleSync(controller.signal);
      return () => controller.abort();
    }
  }, [isConnected, token]);

  // Dynamic language options extracted from repositories
  const languageOptions = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) {
        langs.add(repo.language);
      }
    });
    return [
      { value: "all", label: "All Languages" },
      ...Array.from(langs).map((lang) => ({ value: lang, label: lang })),
    ];
  }, [repos]);

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "sources", label: "Sources" },
    { value: "forks", label: "Forks" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ];

  const sortOptions = [
    { value: "updated", label: "Recently Updated" },
    { value: "stars", label: "Most Stars" },
    { value: "name", label: "Alphabetical" },
  ];

  const filteredAndSortedRepos = useMemo(() => {
    let result = repos.filter(repo => {
      const matchesSearch = 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLanguage = 
        languageFilter === "all" || repo.language === languageFilter;

      let matchesType = true;
      if (typeFilter === "sources") {
        matchesType = !repo.fork;
      } else if (typeFilter === "forks") {
        matchesType = repo.fork;
      } else if (typeFilter === "public") {
        matchesType = repo.visibility === "public";
      } else if (typeFilter === "private") {
        matchesType = repo.visibility === "private";
      }

      return matchesSearch && matchesLanguage && matchesType;
    });

    result.sort((a, b) => {
      if (sortOption === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortOption === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return result;
  }, [repos, searchQuery, sortOption, languageFilter, typeFilter]);

  // Mock health score calculation based on some factors
  const calculateHealthScore = (repo: GithubRepo) => {
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
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Repository Manager</h2>
            {isConnected && (
              <button
                onClick={() => handleSync()}
                disabled={isSyncing}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg border border-white/10 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0"
                title="Sync Repositories"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-400">Analyze health and manage your GitHub repositories.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:col-span-2 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search repositories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
            />
          </div>

          <CustomSelect
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            icon={<Filter className="w-4 h-4 text-gray-400" />}
            className="w-full md:w-44"
          />

          <CustomSelect
            options={languageOptions}
            value={languageFilter}
            onChange={setLanguageFilter}
            icon={<Filter className="w-4 h-4 text-gray-400" />}
            className="w-full md:w-48"
          />

          <CustomSelect
            options={sortOptions}
            value={sortOption}
            onChange={(val) => setSortOption(val as any)}
            icon={<SortDesc className="w-4 h-4 text-gray-400" />}
            className="w-full md:w-52"
          />
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
