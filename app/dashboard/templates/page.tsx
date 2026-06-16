"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { Badge } from "../components/ui/Badge";
import { LayoutTemplate, Star, Plus, Search, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { hasToSViolation, censorText } from "@/lib/censor";
import ReactMarkdown from "react-markdown";

import { templates, Template } from "@/lib/templates";

const sampleData: Record<string, string> = {
  classic: `# Classic Professional README\n\nStandard template featuring clean titles, installation steps, and usage guide.\n\n## 🚀 Getting Started\n\n### Prerequisites\n- Node.js >= 16\n- npm or yarn\n\n### Installation\n\`\`\`bash\nnpm install project-name\n\`\`\`\n\n## 💻 Usage\n\`\`\`javascript\nconst project = require('project-name');\nproject.start();\n\`\`\``,
  portfolio: `# John Doe 🚀\n\nPassionate Full-Stack Developer building modern web applications.\n\n- 🔭 Currently working on Next.js projects\n- 🌱 Learning Rust and WASM\n- 💬 Ask me about React, Node, or Tailwind\n\n## 💻 Tech Stack\n- **Frontend**: React, Next.js, TypeScript, Tailwind\n- **Backend**: Node.js, GraphQL, PostgreSQL\n\n## 📊 Stats\n![GitHub stats](https://github-readme-stats.vercel.app/api?username=johndoe&show_icons=true&theme=tokyonight)`,
  oss: `# OSS Community Hub\n\nWelcome to our Open Source project! We appreciate all contributions.\n\n## 🤝 Contributing\n\nPlease read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.\n\n## 📜 Code of Conduct\nThis project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code.\n\n## ⚖️ License\nThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.`,
  startup: `# SaaS Boilerplate\n\nThe ultimate starter kit for building your next SaaS product.\n\n## 🗺️ Product Roadmap\n- [x] Database authentication setup\n- [/] Subscription billing integration (Stripe)\n- [ ] Analytics dashboard\n\n## 👥 Team\n- **Founder**: Alice Smith\n- **Lead Dev**: Bob Jones`,
  minimal: `# Clean Minimalist\n\n> A minimalist layout for clean projects.\n\n![Preview](https://via.placeholder.com/800x400.png?text=Project+Screenshot)\n\n## Quick Start\n\`\`\`bash\nnpx create-app\n\`\`\``,
  academic: `# Academic Research Project\n\nImplementation of the paper: *"Deep Learning for Automated Readme Generation"*\n\n## 📝 Citation\n\`\`\`bibtex\n@article{doe2026deep,\n  title={Deep Learning for Automated Readme Generation},\n  author={Doe, John and Smith, Jane},\n  journal={arXiv preprint arXiv:2601.12345},\n  year={2026}\n}\n\`\`\`\n\n## 📊 Dataset\nWe use the RepoDocs-2026 dataset, available [here](https://example.com/dataset).`,
  terminal: `# Creative API / SDK\n\nOfficial SDK for the RepoScribe API.\n\n## ⚙️ Installation\n\`\`\`bash\nnpm install @reposcribe/sdk\n\`\`\`\n\n## 🛠️ Usage\n\`\`\`typescript\nimport { RepoScribe } from '@reposcribe/sdk';\n\nconst client = new RepoScribe({ apiKey: 'your_api_key' });\nconst readme = await client.generate({ repoUrl: '...' });\nconsole.log(readme);\n\`\`\``,
  chart: `# Machine Learning Hub\n\nAutomated model training and evaluation suite.\n\n## 📈 Model Performance\n\n| Model | Accuracy | F1-Score | Training Time |\n| :--- | :--- | :--- | :--- |\n| **ResNet-50** | 94.2% | 0.941 | 4.2 hours |\n| **EfficientNet** | 95.8% | 0.957 | 6.1 hours |\n| **MobileNet** | 89.1% | 0.889 | 1.5 hours |\n\n## 🧪 Evaluation\n\`\`\`bash\npython evaluate.py --model efficientnet --dataset cifar10\n\`\`\``
};

function TemplatePreview({ style }: { style: Template["style"] }) {
  switch (style) {
    case "classic":
      return (
        <div className="w-full h-full flex flex-col justify-center px-6 gap-2 opacity-60">
          <div className="w-12 h-2.5 bg-white/20 rounded-full" />
          <div className="w-full h-1.5 bg-white/10 rounded-full" />
          <div className="w-5/6 h-1.5 bg-white/10 rounded-full" />
          <div className="w-4/6 h-1.5 bg-white/10 rounded-full" />
        </div>
      );
    case "portfolio":
      return (
        <div className="w-full h-full flex items-center justify-center gap-4 px-6 opacity-60">
          <div className="w-10 h-10 rounded-full bg-white/20 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-16 h-2.5 bg-white/20 rounded-full" />
            <div className="w-full h-1.5 bg-white/10 rounded-full" />
            <div className="w-3/4 h-1.5 bg-white/10 rounded-full" />
          </div>
        </div>
      );
    case "oss":
      return (
        <div className="w-full h-full flex flex-col justify-center px-6 gap-2 opacity-50">
          <div className="w-20 h-2 bg-white/20 rounded-full mb-1" />
          <div className="grid grid-cols-6 gap-1 w-24">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-sm ${
                  i % 3 === 0
                    ? "bg-emerald-500/40"
                    : i % 5 === 0
                      ? "bg-emerald-400/20"
                      : "bg-white/5"
                }`}
              />
            ))}
          </div>
        </div>
      );
    case "startup":
      return (
        <div className="w-full h-full flex justify-center items-center gap-2 px-6 opacity-60">
          <div className="w-1/3 h-16 bg-white/10 rounded-lg border border-white/5" />
          <div className="w-1/3 h-16 bg-white/10 rounded-lg border border-white/5" />
          <div className="w-1/3 h-16 bg-white/10 rounded-lg border border-white/5" />
        </div>
      );
    case "minimal":
      return (
        <div className="w-full h-full flex flex-col justify-center items-center px-8 opacity-60">
          <div className="w-full h-12 bg-white/10 rounded-lg border border-white/5 flex items-center justify-between px-3">
            <div className="w-4 h-4 rounded-full bg-white/20" />
            <div className="w-16 h-2 bg-white/20 rounded-full" />
            <div className="w-8 h-4 rounded bg-[#7C3AED]/30" />
          </div>
        </div>
      );
    case "academic":
      return (
        <div className="w-full h-full flex flex-col justify-center px-6 gap-2 opacity-60">
          <div className="w-20 h-2.5 bg-white/20 rounded-full" />
          <div className="border border-white/10 rounded-md p-1.5 space-y-1">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <div className="w-8 h-1.5 bg-white/20 rounded-full" />
              <div className="w-6 h-1.5 bg-white/20 rounded-full" />
            </div>
            <div className="flex justify-between">
              <div className="w-12 h-1 bg-white/10 rounded-full" />
              <div className="w-4 h-1 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      );
    case "terminal":
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full h-24 bg-[#09090B] border border-white/10 rounded-lg p-2 font-mono text-[9px] text-[#22D3EE]/80 flex flex-col justify-center gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[#A855F7]">$</span>
              <span>npm install @sdk/client</span>
            </div>
            <div className="text-white/40">✓ Added 24 packages in 0.8s</div>
            <div className="flex items-center gap-1">
              <span className="text-[#A855F7]">$</span>
              <span className="animate-pulse">|</span>
            </div>
          </div>
        </div>
      );
    case "chart":
      return (
        <div className="w-full h-full flex items-end justify-center gap-3 px-8 pb-4 opacity-60">
          <div className="w-6 h-12 bg-[#22D3EE]/30 rounded-t border-t border-x border-[#22D3EE]/50" />
          <div className="w-6 h-16 bg-[#7C3AED]/30 rounded-t border-t border-x border-[#7C3AED]/50" />
          <div className="w-6 h-8 bg-[#A855F7]/30 rounded-t border-t border-x border-[#A855F7]/50" />
        </div>
      );
    default:
      return <LayoutTemplate className="w-12 h-12 text-gray-500" />;
  }
}

export default function TemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  const categories = [
    "All",
    "General",
    "Personal",
    "Community",
    "Business",
    "Design",
    "Data Science",
    "API & CLI",
  ];

  useEffect(() => {
    if (!user) return;

    let active = true;
    const fetchUserFavorites = async () => {
      try {
        const docRef = doc(db, "favorites", user.uid);
        const docSnap = await getDoc(docRef);
        if (active && docSnap.exists()) {
          const data = docSnap.data();
          if (data && Array.isArray(data.items)) {
            const ids = data.items
              .filter(
                (item: any) =>
                  item.type === "Template" &&
                  String(item.id).startsWith("template-"),
              )
              .map((item: any) =>
                parseInt(String(item.id).replace("template-", ""), 10),
              );
            setFavoritedIds(ids);
          }
        }
      } catch (err) {
        console.error("Error fetching favorites for templates:", err);
      }
    };
    fetchUserFavorites();
    return () => {
      active = false;
    };
  }, [user]);

  const handleToggleFavorite = async (template: Template) => {
    if (!user) {
      toast.error("Please login to add to favorites!");
      return;
    }

    const isFav = favoritedIds.includes(template.id);
    let updatedIds: number[];
    if (isFav) {
      updatedIds = favoritedIds.filter((id) => id !== template.id);
    } else {
      updatedIds = [...favoritedIds, template.id];
    }

    try {
      const docRef = doc(db, "favorites", user.uid);
      const docSnap = await getDoc(docRef);
      let currentItems: any[] = [];
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.items)) {
          currentItems = data.items;
        }
      }

      let updatedItems: any[];
      if (isFav) {
        updatedItems = currentItems.filter(
          (item: any) => item.id !== `template-${template.id}`,
        );
      } else {
        updatedItems = [
          ...currentItems,
          {
            id: `template-${template.id}`,
            type: "Template",
            title: template.name,
            description: template.description,
            date: "Just now",
            uses: template.views,
          },
        ];
      }

      await setDoc(docRef, { items: updatedItems }, { merge: true });
      setFavoritedIds(updatedIds);
      toast.success(isFav ? "Removed from favorites" : "Added to favorites!");
    } catch (err) {
      console.error("Error updating favorite in Firestore:", err);
      toast.error("Failed to update favorites.");
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      activeCategory === "All" || template.category === activeCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            README Templates
          </h1>
          <p className="text-gray-400">
            Choose from a variety of professionally designed layouts.
          </p>
        </div>
        <button
          onClick={() => setIsCustomModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Custom
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-white/5 pb-4">
        <div className="flex overflow-x-auto w-full sm:w-auto scrollbar-hide bg-[#09090B] border border-white/10 rounded-xl p-1 gap-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === category
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-auto shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="block w-full sm:w-64 pl-9 pr-4 py-2 text-sm bg-[#09090B] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, i) => {
            const isFavorite = favoritedIds.includes(template.id);
            return (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
              >
                <GlassCard
                  hoverEffect
                  className="group overflow-hidden flex flex-col h-full relative"
                >
                  <div className="h-40 bg-gradient-to-br from-[#09090B] to-white/5 border-b border-white/10 relative flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[#7C3AED]/0 group-hover:bg-[#7C3AED]/5 transition-colors duration-300" />

                    {/* Action buttons */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      {template.featured ? (
                        <Badge
                          variant="accent"
                          className="flex items-center gap-1 shadow-lg backdrop-blur-md bg-[#22D3EE]/20 border-[#22D3EE]/30"
                        >
                          <Star className="w-3 h-3 fill-current text-[#22D3EE]" />{" "}
                          Featured
                        </Badge>
                      ) : (
                        <div />
                      )}
                      <button
                        onClick={() => handleToggleFavorite(template)}
                        className={`p-2 rounded-lg backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors shadow-lg ${
                          isFavorite
                            ? "text-yellow-500 bg-white/10"
                            : "text-gray-400 bg-[#09090B]/50 hover:text-white"
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>

                    <TemplatePreview style={template.style} />
                  </div>

                  <div className="p-5 flex-1 flex flex-col relative">
                    <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-[#7C3AED] transition-colors">
                      {template.name}
                    </h3>
                    <div className="text-xs text-gray-500 mb-3">
                      {template.category}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                      {template.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="flex-1 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 py-2.5 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          const prompt = `Generate a comprehensive README following the ${template.name} theme. It should have a ${template.style} style layout and include these key aspects: ${template.description}`;
                          router.push(
                            `/dashboard/generate?theme=${encodeURIComponent(template.name)}&prompt=${encodeURIComponent(prompt)}`,
                          );
                        }}
                        className="flex-1 text-sm font-medium text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-95 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.2)] hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] cursor-pointer"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500"
          >
            <LayoutTemplate className="w-12 h-12 mb-4 text-gray-600" />
            <p className="text-lg">No templates found</p>
            <p className="text-sm mt-1">
              Try adjusting your search or category filters.
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isCustomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCustomModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md"
            >
              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Create Custom Template
                  </h3>
                  <button
                    onClick={() => setIsCustomModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. My Custom React Setup"
                      className="w-full px-4 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Briefly describe what this template should include..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => setIsCustomModalOpen(false)}
                      className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const titleViolation = hasToSViolation(customTitle);
                        const descViolation = hasToSViolation(customDescription);
                        if (titleViolation.violated || descViolation.violated) {
                          toast.error(`Input violates Terms & Conditions (prohibited word: "${titleViolation.word || descViolation.word}")`);
                          return;
                        }
                        const cleanTitle = censorText(customTitle);
                        const cleanDesc = censorText(customDescription);
                        const prompt = `Generate a README for a custom project template named "${cleanTitle}". Description: ${cleanDesc}`;
                        router.push(
                          `/dashboard/generate?theme=Custom&prompt=${encodeURIComponent(prompt)}`,
                        );
                      }}
                      disabled={!customTitle.trim()}
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setPreviewTemplate(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col z-10"
            >
              <GlassCard className="p-8 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 shrink-0">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {previewTemplate.name} Preview
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Showing sample data rendered in this template's layout.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#09090B]/50 rounded-xl p-8 border border-white/5 prose prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-6 mb-4 border-b border-white/10 pb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3 border-b border-white/5 pb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-bold text-white mt-4 mb-2">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-300 leading-relaxed my-3">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside space-y-2 my-4 pl-4 text-gray-300">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 my-4 pl-4 text-gray-300">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-300">{children}</li>,
                      code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-[#22D3EE] font-mono">{children}</code>,
                      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:underline">{children}</a>,
                      img: ({ src, alt }) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt={alt || ""} className="inline-block max-w-full rounded-md border border-white/5 my-2 mr-4" />
                      ),
                    }}
                  >
                    {sampleData[previewTemplate.style] || ""}
                  </ReactMarkdown>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="py-2.5 px-5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const template = previewTemplate;
                      setPreviewTemplate(null);
                      const prompt = `Generate a comprehensive README following the ${template.name} theme. It should have a ${template.style} style layout and include these key aspects: ${template.description}`;
                      router.push(
                        `/dashboard/generate?theme=${encodeURIComponent(template.name)}&prompt=${encodeURIComponent(prompt)}`,
                      );
                    }}
                    className="py-2.5 px-5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] cursor-pointer"
                  >
                    Use Template
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
