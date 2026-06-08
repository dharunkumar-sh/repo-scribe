import { useRouter } from "next/navigation";
import { GithubRepo } from "@/lib/github";
import { Star, GitFork, Sparkles, BookMarked, Activity } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface RepositoryCardProps {
  repo: GithubRepo;
  healthScore?: number;
}

export function RepositoryCard({ repo, healthScore = 70 }: RepositoryCardProps) {
  const router = useRouter();

  // A simple mock calculation or display logic for Health
  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
    if (score >= 70) return "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20";
    return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
  };

  const getLanguageColor = (lang: string | null) => {
    if (!lang) return "bg-gray-500";
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

  const handleGenerateClick = () => {
    router.push(`/dashboard/generate?url=${encodeURIComponent(repo.html_url)}`);
  };

  return (
    <GlassCard className="p-5 hover:border-[#7C3AED]/30 transition-all group flex flex-col h-full relative overflow-hidden">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-gray-400" />
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-lg font-bold text-white hover:text-[#7C3AED] transition-colors truncate max-w-[200px] sm:max-w-[250px]"
          >
            {repo.name}
          </a>
          <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 bg-white/5 border border-white/10 rounded-full">
            {repo.visibility}
          </span>
        </div>
        
        {/* Health Score Badge */}
        <div className={`px-2 py-1 rounded-md text-xs font-bold border flex items-center gap-1 ${getHealthColor(healthScore)}`} title="Repository Health Score">
          <Activity className="w-3 h-3" />
          {healthScore}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">
        {repo.description || "No description provided. Consider adding one to improve repository health."}
      </p>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="px-2 py-0.5 text-xs text-[#22D3EE] bg-[#22D3EE]/10 rounded-full border border-[#22D3EE]/20">
              {topic}
            </span>
          ))}
          {repo.topics.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-gray-400 bg-white/5 rounded-full border border-white/10">
              +{repo.topics.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer Metrics */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
              {repo.language}
            </div>
          )}
          <div className="flex items-center gap-1 hover:text-[#EAB308] transition-colors cursor-pointer">
            <Star className="w-3.5 h-3.5" />
            {repo.stargazers_count}
          </div>
          <div className="flex items-center gap-1 hover:text-[#22D3EE] transition-colors cursor-pointer">
            <GitFork className="w-3.5 h-3.5" />
            {repo.forks_count}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleGenerateClick}
            className="p-1.5 bg-[#7C3AED]/10 text-[#A855F7] rounded hover:bg-[#7C3AED]/20 transition-colors" 
            title="Generate README"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
