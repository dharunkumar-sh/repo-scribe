"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Star,
  Users,
  GitFork,
  RefreshCw,
  Sparkles,
  TrendingUp,
  BookMarked,
  ShieldCheck,
  AlertCircle,
  Plug,
  Code2,
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { AnimatedStat } from "../components/ui/AnimatedStat";
import { GithubIcon } from "../components/ui/GithubIcon";
import { useGithubStore } from "@/store/useGithubStore";
import { fetchGithubProfile, fetchGithubRepos } from "@/lib/github";
import { buildGithubOAuthUrl } from "@/lib/githubOAuth";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

// ──────────────────────────────────────────────
// Cookie helpers (client-side)
// ──────────────────────────────────────────────
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

// ──────────────────────────────────────────────
// Skeleton loader
// ──────────────────────────────────────────────
function SyncingSkeleton() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      <GlassCard className="p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/10" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 bg-white/10 rounded" />
            <div className="h-3 w-72 bg-white/5 rounded" />
            <div className="h-3 w-32 bg-white/5 rounded" />
          </div>
        </div>
      </GlassCard>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassCard key={i} className="p-5 h-24">
            <div className="h-3 w-24 bg-white/10 rounded mb-3" />
            <div className="h-7 w-16 bg-white/5 rounded" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Connect screen
// ──────────────────────────────────────────────
function ConnectScreen({
  onConnect,
  isConnecting,
  oauthError,
}: {
  onConnect: () => void;
  isConnecting: boolean;
  oauthError: string | null;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mx-auto mb-6 shadow-[0_0_80px_rgba(124,58,237,0.2)] relative">
          <GithubIcon className="w-12 h-12 text-white" />
          <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#7C3AED] rounded-full flex items-center justify-center border-2 border-[#09090B]">
            <Plug className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Connect GitHub Profile Manager
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Authorize the RepoScribe GitHub App to sync your repositories, view
          analytics, and get AI-powered profile insights — all in one place.
        </p>

        {/* What we access */}
        <GlassCard className="p-5 mb-6 text-left">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Permissions requested
          </p>
          <ul className="space-y-2.5">
            {[
              {
                scope: "repo",
                description: "Read your public & private repositories",
              },
              {
                scope: "read:user",
                description: "Read your GitHub profile information",
              },
              {
                scope: "user:email",
                description: "Access your verified email address",
              },
            ].map(({ scope, description }) => (
              <li key={scope} className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] rounded-md font-mono text-xs shrink-0">
                  {scope}
                </span>
                <span className="text-sm text-gray-300">{description}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Error from previous OAuth attempt */}
        {oauthError && (
          <div className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{oauthError}</p>
          </div>
        )}

        {/* Connect Button */}
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Redirecting to GitHub…
            </>
          ) : (
            <>
              <GithubIcon className="w-5 h-5" />
              Authorize with GitHub
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          You can revoke access anytime from your GitHub account settings.
        </p>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main page (inner — needs Suspense for useSearchParams)
// ──────────────────────────────────────────────
function GitHubOverviewPageInner() {
  const {
    token,
    profile,
    repos,
    isConnected,
    setToken,
    setProfile,
    setRepos,
    setLoading,
    setError,
    disconnect,
  } = useGithubStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  // ── Compute real stats ──
  const totalStars = useMemo(
    () => repos.reduce((acc, r) => acc + r.stargazers_count, 0),
    [repos],
  );
  const totalForks = useMemo(
    () => repos.reduce((acc, r) => acc + r.forks_count, 0),
    [repos],
  );

  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const colors = ["#7C3AED", "#22D3EE", "#10B981", "#F59E0B"];
    return Object.entries(counts)
      .map(([lang, count], index) => ({
        name: lang,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        count,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [repos]);

  const topRepos = useMemo(() => {
    return [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count)
      .slice(0, 3);
  }, [repos]);

  const advancedMetrics = useMemo(() => {
    const total = repos.length || 1;
    const withLicense = repos.filter((r) => r.license).length;
    const withDesc = repos.filter((r) => r.description).length;
    const isFork = repos.filter((r) => r.fork).length;

    return {
      licenseRate: Math.round((withLicense / total) * 100),
      descRate: Math.round((withDesc / total) * 100),
      forkRate: Math.round((isFork / total) * 100),
    };
  }, [repos]);

  // ── Core sync ──
  const syncGithubData = useCallback(
    async (accessToken: string, throwOnError = false, signal?: AbortSignal) => {
      setIsSyncing(true);
      try {
        const [profileData, reposData] = await Promise.all([
          fetchGithubProfile(accessToken, signal),
          fetchGithubRepos(accessToken, signal),
        ]);
        setProfile(profileData);
        setRepos(reposData);
      } catch (error: any) {
        if (error.name === "AbortError") return;
        toast.error("Failed to sync GitHub data. Try reconnecting.");
        if (throwOnError) throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [setProfile, setRepos],
  );

  // ── On mount: handle OAuth callback ──
  useEffect(() => {
    const controller = new AbortController();
    const ghError = searchParams.get("gh_error");
    const ghConnected = searchParams.get("gh_connected");

    // Clean URL regardless
    if (ghError || ghConnected) {
      router.replace("/dashboard/github", { scroll: false });
    }

    // OAuth returned an error
    if (ghError) {
      setOauthError(decodeURIComponent(ghError));
      return;
    }

    // Successful OAuth callback — read token from cookie
    if (ghConnected === "1") {
      const cookieToken = getCookie("gh_access_token");
      if (cookieToken) {
        deleteCookie("gh_access_token");
        setToken(cookieToken);
        toast.success("GitHub connected!");
        syncGithubData(cookieToken, false, controller.signal);
        return;
      }
    }

    // Returning user: token persisted but profile lost (e.g. cleared cache)
    if (token && !profile && !isSyncing) {
      syncGithubData(token, false, controller.signal);
    }

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Redirect to GitHub OAuth ──
  const handleConnect = () => {
    setIsConnecting(true);
    try {
      const callbackUrl =
        process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI ||
        `${window.location.origin}/api/github/callback`;
      const authUrl = buildGithubOAuthUrl(callbackUrl);
      window.location.href = authUrl;
    } catch (err: any) {
      toast.error(err.message || "Could not initiate GitHub authorization.");
      setIsConnecting(false);
    }
  };

  // ── Manual re-sync ──
  const handleResync = () => {
    if (!token) return;
    toast.promise(syncGithubData(token), {
      loading: "Syncing repositories…",
      success: "Repositories synced!",
      error: "Sync failed. You may need to reconnect.",
    });
  };

  // ── Loading / syncing skeleton ──
  if ((isConnected && !profile) || isSyncing) {
    return <SyncingSkeleton />;
  }

  // ── Not connected ──
  if (!isConnected || !profile) {
    return (
      <ConnectScreen
        onConnect={handleConnect}
        isConnecting={isConnecting}
        oauthError={oauthError}
      />
    );
  }

  // ── Connected dashboard ──
  return (
    <div className="space-y-6 pb-12">
      {/* Profile Header */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7C3AED]/20 to-transparent rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden relative shrink-0">
              <Image
                src={profile.avatar_url}
                alt={profile.login}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {profile.name || profile.login}
              </h2>
              <p className="text-gray-400 text-sm">
                {profile.bio || "No bio provided"}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {profile.followers} followers
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {profile.following} following
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard/repositories"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#A855F7] rounded-lg text-sm font-medium hover:bg-[#7C3AED]/20 transition-colors"
            >
              <BookMarked className="w-4 h-4" />
              Repositories
            </Link>
            <button
              onClick={handleResync}
              disabled={isSyncing}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              Sync
            </button>
            <button
              onClick={disconnect}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <BookMarked className="w-4 h-4 text-[#7C3AED]" />
            <span className="text-sm font-medium">Public Repos</span>
          </div>
          <AnimatedStat
            value={profile.public_repos}
            className="text-3xl font-bold text-white"
          />
        </GlassCard>
        <GlassCard className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Star className="w-4 h-4 text-[#EAB308]" />
            <span className="text-sm font-medium">Stars Earned</span>
          </div>
          <AnimatedStat
            value={totalStars}
            className="text-3xl font-bold text-white"
          />
        </GlassCard>
        <GlassCard className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <GitFork className="w-4 h-4 text-[#22D3EE]" />
            <span className="text-sm font-medium">Total Forks</span>
          </div>
          <AnimatedStat
            value={totalForks}
            className="text-3xl font-bold text-white"
          />
        </GlassCard>
        <GlassCard className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm font-medium">Profile Score</span>
          </div>
          <div className="flex items-end gap-1">
            <AnimatedStat
              value={85}
              className="text-3xl font-bold text-white"
            />
            <span className="text-gray-500 text-sm mb-1">/100</span>
          </div>
        </GlassCard>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Repositories */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <BookMarked className="w-5 h-5 text-[#7C3AED]" />
              Top Repositories by Stars
            </h3>
            <div className="space-y-4">
              {topRepos.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No repositories found.</p>
              ) : (
                topRepos.map((repo) => (
                  <div key={repo.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/[0.08] transition-colors">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate">{repo.name}</span>
                        {repo.language && (
                          <span className="px-2 py-0.5 bg-white/10 text-gray-300 text-[10px] font-medium rounded-full">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate max-w-[320px] sm:max-w-[450px]">
                        {repo.description || "No description provided"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 pl-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Star className="w-3.5 h-3.5 text-[#EAB308]" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <GitFork className="w-3.5 h-3.5 text-[#22D3EE]" />
                        <span>{repo.forks_count}</span>
                      </div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Languages & Advanced Metrics */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Code2 className="w-5 h-5 text-[#22D3EE]" />
              Languages Distribution
            </h3>
            <div className="space-y-4">
              {languageStats.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No language data.</p>
              ) : (
                languageStats.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-300 font-medium">{lang.name}</span>
                      <span className="text-gray-400">{lang.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${lang.percentage}%`,
                          backgroundColor: lang.color,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                  License Rate
                </p>
                <p className="text-xl font-bold text-white">{advancedMetrics.licenseRate}%</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                  Descriptions
                </p>
                <p className="text-xl font-bold text-white">{advancedMetrics.descRate}%</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Audit & Recommendations Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Profile Score */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7C3AED]" />
                AI Profile Score Analysis
              </h3>
              <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs font-medium border border-[#10B981]/20">
                Excellent
              </span>
            </div>
            <div className="space-y-5">
              {[
                {
                  label: "Documentation (READMEs)",
                  pct: 70,
                  from: "#7C3AED",
                  to: "#A855F7",
                },
                {
                  label: "Repository Health",
                  pct: 85,
                  from: "#22D3EE",
                  to: "#3B82F6",
                },
                {
                  label: "Activity & Consistency",
                  pct: 92,
                  from: "#10B981",
                  to: "#059669",
                },
              ].map(({ label, pct, from, to }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300 font-medium">{label}</span>
                    <span className="text-white">{pct}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(to right, ${from}, ${to})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <GlassCard className="p-6 border-[#7C3AED]/20 bg-gradient-to-b from-[#7C3AED]/5 to-transparent">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#22D3EE]" />
              AI Recommendations
            </h3>
            <ul className="space-y-3">
              <li className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">
                  Your profile is missing a custom README — crucial for a strong
                  portfolio.
                </p>
                <button className="text-xs font-medium text-[#7C3AED] hover:text-[#A855F7] flex items-center gap-1 transition-colors">
                  Generate Profile README <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">
                  {repos.filter((r) => !r.description).length} repositories have
                  no description.
                </p>
                <button className="text-xs font-medium text-[#7C3AED] hover:text-[#A855F7] flex items-center gap-1 transition-colors">
                  Improve Descriptions <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">
                  Add topics to your latest repository for better
                  discoverability.
                </p>
                <button className="text-xs font-medium text-[#7C3AED] hover:text-[#A855F7] flex items-center gap-1 transition-colors">
                  Add Topics <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense — required because useSearchParams() is used inside
export default function GitHubOverviewPage() {
  return (
    <Suspense fallback={<SyncingSkeleton />}>
      <GitHubOverviewPageInner />
    </Suspense>
  );
}
