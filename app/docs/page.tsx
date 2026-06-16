"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { BookOpen, Code2, Cpu, Settings, HelpCircle, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const sections = [
  { id: "quickstart", title: "Quickstart Guide", icon: BookOpen },
  { id: "github-app", title: "GitHub App Sync", icon: Code2 },
  { id: "templates", title: "Customizing Templates", icon: Settings },
  { id: "ai-tips", title: "AI Optimization Tips", icon: Cpu },
  { id: "faq", title: "Frequently Asked Questions", icon: HelpCircle },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [copiedText, setCopiedText] = useState("");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedText(""), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 relative">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="border-b border-white/10 pb-8 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Documentation</h1>
            <p className="text-muted-foreground text-lg">
              Learn how to configure, customize, and automate your GitHub READMEs with RepoScribe AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Sidebar navigation */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="glass p-5 rounded-3xl border border-white/10 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-3">Navigation</p>
                {sections.map((s) => {
                  const Icon = s.icon;
                  const isActive = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-gray-500"}`} />
                      {s.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Documentation contents */}
            <div className="lg:col-span-8 space-y-16 text-muted-foreground leading-relaxed">
              
              {/* Quickstart Guide */}
              <section id="quickstart" className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-accent" />
                  Quickstart Guide
                </h2>
                <p>
                  RepoScribe AI makes it incredibly simple to build standard, gorgeous README documentation for any public GitHub repository. Follow these three steps:
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Authenticate Your Account</h4>
                      <p className="text-sm">Log in using your GitHub account or Email to access the developer dashboard.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Paste Your Repository URL</h4>
                      <p className="text-sm">On the Generate page, paste the link to your public repository. E.g., `https://github.com/username/repo-name`.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Select a Template and Export</h4>
                      <p className="text-sm">Choose from our pre-designed layouts (Minimal, Scientific, Playful, Dashboard). Preview the output, copy it, or commit directly back to GitHub.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* GitHub App Sync */}
              <section id="github-app" className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Code2 className="w-7 h-7 text-accent" />
                  GitHub App Sync
                </h2>
                <p>
                  Automate documentation updating! By connecting the RepoScribe GitHub App, you can configure your repositories to automatically re-generate the README whenever you push new changes to the main branch or merge a pull request.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h4 className="font-semibold text-white text-sm">Add a configurations file to your repo:</h4>
                  <p className="text-xs">Create a file named `.reposcribe.json` in the root of your project to control automatic updates:</p>
                  
                  <div className="relative">
                    <pre className="bg-black/40 rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
{`{
  "template": "minimal",
  "ignoredFiles": ["dist/**", "tmp/**"],
  "focus": "features, installation",
  "autoCommit": true
}`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`{\n  "template": "minimal",\n  "ignoredFiles": ["dist/**", "tmp/**"],\n  "focus": "features, installation",\n  "autoCommit": true\n}`, "app-json")}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white"
                    >
                      {copiedText === "app-json" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </section>

              {/* Customizing Templates */}
              <section id="templates" className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Settings className="w-7 h-7 text-accent" />
                  Customizing Templates
                </h2>
                <p>
                  RepoScribe offers multiple structured templates designed to show off your code. We currently provide the following preset templates:
                </p>
                <ul className="list-disc pl-5 space-y-3">
                  <li><strong className="text-white">Minimal:</strong> Sleek and elegant layout for simple packages, utilities, or command-line utilities. Focuses on quick setup.</li>
                  <li><strong className="text-white">Scientific:</strong> Detailed sections for academic work, algorithmic analyses, and data science notebooks, supporting math layouts and data structures.</li>
                  <li><strong className="text-white">Playful:</strong> Fun design using bright badges, emojis, and step-by-step illustrations. Excellent for starter packs or game projects.</li>
                  <li><strong className="text-white">Dashboard:</strong> Ideal for full-stack apps and SaaS products. Focuses on screenshots, configuration tables, databases, and microservice architectures.</li>
                </ul>
              </section>

              {/* AI Optimization Tips */}
              <section id="ai-tips" className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Cpu className="w-7 h-7 text-accent" />
                  AI Optimization Tips
                </h2>
                <p>
                  Our analyzer uses code structures, imports, and comments to understand your product. To get the absolute best README results, follow these code organization tips:
                </p>
                <div className="space-y-4">
                  <div className="glass p-5 rounded-2xl border border-white/10 space-y-2">
                    <h5 className="font-semibold text-white">1. Add descriptions inside package.json / Cargo.toml / pyproject.toml</h5>
                    <p className="text-sm">The AI checks the root package files first. Ensure you fill in the `description` and `keywords` tags.</p>
                  </div>
                  <div className="glass p-5 rounded-2xl border border-white/10 space-y-2">
                    <h5 className="font-semibold text-white">2. Include a config example</h5>
                    <p className="text-sm">Provide a `.env.example` or sample configuration file. The AI automatically identifies and creates environment setup guides from it.</p>
                  </div>
                  <div className="glass p-5 rounded-2xl border border-white/10 space-y-2">
                    <h5 className="font-semibold text-white">3. Docstrings in entry points</h5>
                    <p className="text-sm">A short comment description at the top of your index file or entry module (e.g. `index.js`, `main.py`) helps clarify user intentions.</p>
                  </div>
                </div>
              </section>

              {/* Frequently Asked Questions */}
              <section id="faq" className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <HelpCircle className="w-7 h-7 text-accent" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h4 className="font-semibold text-white mb-2">Can I generate READMEs for private repositories?</h4>
                    <p className="text-sm">Yes, but private repositories require logging in through GitHub and granting read permission scopes to your specific repository.</p>
                  </div>
                  <div className="border-b border-white/5 pb-4">
                    <h4 className="font-semibold text-white mb-2">Does RepoScribe support formatting tables, emojis, and code-highlights?</h4>
                    <p className="text-sm">Absolutely. All templates are optimized to leverage markdown highlights, badge APIs, tables, and standard headers.</p>
                  </div>
                  <div className="border-b border-white/5 pb-4">
                    <h4 className="font-semibold text-white mb-2">Is there a limit on how many READMEs I can generate?</h4>
                    <p className="text-sm">Free accounts get up to 5 generations per month. Upgrade to Premium for unlimited AI generations and GitHub App automatic commits.</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
