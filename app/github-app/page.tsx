"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { GitBranch, GitPullRequest, ArrowRight, CheckCircle, RefreshCw, Zap } from "lucide-react";
import { GithubIcon } from "@/app/dashboard/components/ui/GithubIcon";
import toast from "react-hot-toast";
import { useState } from "react";

export default function GitHubAppPage() {
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  const handleInstall = async () => {
    setInstalling(true);
    // Simulate GitHub App authorization process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setInstalling(false);
    setInstalled(true);
    toast.success("GitHub App installed successfully on authorized repositories!");
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 relative">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <GithubIcon className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-muted">Official Integration</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              Continuous Documentation <br />
              <span className="text-gradient">With Our GitHub App</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              No more manual copy-pasting. Sync your repositories and let RepoScribe update your README.md on every merge, pull request, or commit automatically.
            </p>

            <div className="mt-8 flex justify-center">
              {!installed ? (
                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {installing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Connecting to GitHub...
                    </>
                  ) : (
                    <>
                      <GithubIcon className="w-5 h-5" />
                      Install RepoScribe App
                    </>
                  )}
                </button>
              ) : (
                <div className="glass px-6 py-4 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Integration Active and Installed
                </div>
              )}
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-white mb-12">How Continuous Sync Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector lines (Desktop only) */}
              <div className="hidden md:block absolute top-1/2 left-[25%] right-[25%] h-px border-t border-dashed border-white/20 -translate-y-1/2 z-0" />

              {/* Step 1 */}
              <div className="glass p-8 rounded-3xl border border-white/10 relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                  <GitBranch className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">1. Push New Code</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You commit files, add components, or modify dependency imports in your GitHub repository.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass p-8 rounded-3xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center mb-6 shadow-lg">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">2. RepoScribe Parses</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our GitHub webhook triggers an analysis process. RepoScribe scans structure changes and dependencies in under 5 seconds.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass p-8 rounded-3xl border border-white/10 relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                  <GitPullRequest className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">3. Auto Commit README</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  RepoScribe generates the updated documentation and opens a Pull Request or commits the updated README.md directly to your default branch.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="glass rounded-3xl border border-white/10 p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-6">Integration Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex gap-3">
                <div className="text-accent shrink-0">✓</div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Branch Filtering</h4>
                  <p className="text-muted-foreground">Only trigger updates on designated branches (e.g. `main` or `dev`).</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-accent shrink-0">✓</div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Pull Request Previews</h4>
                  <p className="text-muted-foreground">See the proposed README markdown diff as a comment inside the pull request before merging.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-accent shrink-0">✓</div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Monorepo Support</h4>
                  <p className="text-muted-foreground">Configure multiple subfolders within a single repository to generate distinct readmes for packages.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-accent shrink-0">✓</div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Custom Ignore Rules</h4>
                  <p className="text-muted-foreground">Specify directories (e.g., node_modules, logs, build outputs) that the analyzer should overlook.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
