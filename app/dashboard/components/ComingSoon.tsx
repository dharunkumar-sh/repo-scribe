import { GlassCard } from "./ui/GlassCard";
import { Sparkles, Hammer } from "lucide-react";

export function ComingSoon({ title, description }: { title: string, description: string }) {
  return (
    <div className="h-[80vh] flex items-center justify-center">
      <GlassCard className="p-12 max-w-lg text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-20 h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-white/10">
          <Hammer className="w-10 h-10 text-[#A855F7]" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-3 relative z-10">{title}</h1>
        <p className="text-gray-400 mb-8 relative z-10">
          {description}
        </p>
        
        <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors relative z-10 flex items-center justify-center gap-2 mx-auto">
          <Sparkles className="w-4 h-4" />
          Notify Me
        </button>
      </GlassCard>
    </div>
  );
}
