import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "accent" | "outline" | "success" | "warning";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-white",
    primary: "bg-[#7C3AED]/20 text-[#A855F7]",
    accent: "bg-[#22D3EE]/20 text-[#22D3EE]",
    outline: "border border-white/20 text-gray-300",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
