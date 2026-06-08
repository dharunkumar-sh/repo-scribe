"use client";

import { useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { Badge } from "../components/ui/Badge";
import { FolderDot, Star, GitFork, Clock, MoreVertical, RefreshCw } from "lucide-react";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import { useGithubStore } from "@/store/useGithubStore";
import { fetchGithubRepos } from "@/lib/github";
import toast from "react-hot-toast";
import Link from "next/link";

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins || 1}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
}

export default function ProjectsPage() {
  const { repos, isConnected, token, setRepos } = useGithubStore();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const reposData = await fetchGithubRepos(token);
      setRepos(reposData);
      toast.success("Repositories synced!");
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      toast.error("Failed to sync repositories.");
    } finally {
      setIsSyncing(false);
    }
  };

  const projects = repos.map((repo) => {
    // Generate a status dynamically for demonstration
    let status = "Draft";
    if (repo.stargazers_count > 10) {
      status = "Generated";
    } else if (repo.description) {
      status = "Needs Update";
    }

    return {
      id: repo.id,
      name: repo.name,
      language: repo.language || "Markdown",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated: formatTimeAgo(new Date(repo.updated_at)),
      status,
      html_url: repo.html_url,
    };
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <FolderDot className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Connected Repositories</h2>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          Connect your GitHub account in the Profile Manager to import and manage your projects.
        </p>
        <Link
          href="/dashboard/github"
          className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
        >
          Go to GitHub Profile Manager
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Projects</h1>
          <p className="text-gray-400">Manage your connected repositories and generated documentation.</p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSyncing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <GithubIcon className="w-4 h-4" />
          )}
          {isSyncing ? "Syncing..." : "Sync Repositories"}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <p className="text-gray-400">No repositories found in your GitHub profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <GlassCard key={project.id} hoverEffect className="p-5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <FolderDot className="w-5 h-5 text-[#22D3EE]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white truncate w-32 sm:w-48" title={project.name}>
                      {project.name}
                    </h3>
                    <div className="text-xs text-gray-500">{project.language}</div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                <span className="flex items-center gap-1" title="Stars"><Star className="w-3.5 h-3.5" /> {project.stars}</span>
                <span className="flex items-center gap-1" title="Forks"><GitFork className="w-3.5 h-3.5" /> {project.forks}</span>
                <span className="flex items-center gap-1" title="Last Updated"><Clock className="w-3.5 h-3.5" /> {project.updated}</span>
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <Badge variant={project.status === "Generated" ? "success" : project.status === "Draft" ? "warning" : "default"}>
                  {project.status}
                </Badge>
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-[#7C3AED] hover:text-[#A855F7] transition-colors"
                >
                  View Details
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
