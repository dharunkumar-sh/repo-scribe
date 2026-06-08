"use client";

import { GlassCard } from "../components/ui/GlassCard";
import { Badge } from "../components/ui/Badge";
import { LayoutTemplate, Star, Eye, Plus } from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    { name: "Professional", category: "General", views: "12k", featured: true },
    { name: "Portfolio", category: "Personal", views: "8.5k", featured: false },
    { name: "Open Source", category: "Community", views: "24k", featured: true },
    { name: "Startup", category: "Business", views: "5.2k", featured: false },
    { name: "Minimal", category: "Design", views: "15k", featured: false },
    { name: "Academic", category: "Research", views: "3.1k", featured: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">README Templates</h1>
          <p className="text-gray-400">Choose from a variety of professionally designed layouts.</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-lg transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Custom
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, i) => (
          <GlassCard key={i} hoverEffect className="group overflow-hidden flex flex-col">
            <div className="h-40 bg-gradient-to-br from-[#09090B] to-white/5 border-b border-white/10 relative p-4 flex flex-col items-center justify-center">
              {template.featured && (
                <div className="absolute top-3 right-3">
                  <Badge variant="accent" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </Badge>
                </div>
              )}
              <LayoutTemplate className="w-12 h-12 text-gray-500 group-hover:text-[#7C3AED] transition-colors mb-2" />
              <div className="w-3/4 h-2 bg-white/5 rounded-full mb-1"></div>
              <div className="w-1/2 h-2 bg-white/5 rounded-full"></div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-medium text-white text-lg mb-1">{template.name}</h3>
              <div className="text-sm text-gray-500 mb-4">{template.category}</div>
              
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye className="w-3.5 h-3.5" /> {template.views} uses
                </div>
                <button className="text-sm font-medium text-[#7C3AED] hover:text-[#A855F7] transition-colors">
                  Use Template
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
