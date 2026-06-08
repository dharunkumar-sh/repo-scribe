"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { CommandPalette } from "./components/CommandPalette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#09090B] text-[#FAFAFA] overflow-hidden selection:bg-[#7C3AED] selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto scrollbar-hide relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="relative z-10 container mx-auto p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
