"use client";

import { GlassCard } from "../components/ui/GlassCard";
import { Badge } from "../components/ui/Badge";
import { Search, Filter, Download, Trash2, Edit3 } from "lucide-react";

export default function HistoryPage() {
  const history = [
    { name: "repo-scribe-readme", repo: "dharunkumar-sh/repo-scribe", date: "2026-06-07", status: "Completed" },
    { name: "portfolio-v2", repo: "dharunkumar-sh/portfolio", date: "2026-06-05", status: "Draft" },
    { name: "api-docs", repo: "org/core-api", date: "2026-06-01", status: "Completed" },
    { name: "startup-landing", repo: "startup/landing-page", date: "2026-05-28", status: "Failed" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Generation History</h1>
        <p className="text-gray-400">View and manage all your previously generated READMEs.</p>
      </div>

      <GlassCard className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="w-full pl-9 pr-4 py-2 bg-[#09090B] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
          />
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2 text-sm w-full sm:w-auto">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </GlassCard>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#09090B]/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/5 text-gray-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Repository</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((item, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                  <td className="px-6 py-4 text-gray-400">{item.repo}</td>
                  <td className="px-6 py-4 text-gray-400">{item.date}</td>
                  <td className="px-6 py-4">
                    <Badge variant={item.status === "Completed" ? "success" : item.status === "Failed" ? "warning" : "default"}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-gray-400 hover:text-white transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-[#22D3EE] transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
