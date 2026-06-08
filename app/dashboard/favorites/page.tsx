"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { Star, LayoutTemplate, FileCode2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

import { FavoriteItem } from "@/lib/types";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["All", "READMEs", "Templates"];

  useEffect(() => {
    let active = true;

    if (!user) {
      const timer = setTimeout(() => {
        if (active) {
          setFavorites([]);
          setIsLoading(false);
        }
      }, 0);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }

    const fetchFavorites = async () => {
      try {
        const docRef = doc(db, "favorites", user.uid);
        const docSnap = await getDoc(docRef);
        if (active && docSnap.exists()) {
          const data = docSnap.data();
          if (data && Array.isArray(data.items)) {
            setFavorites(data.items);
          }
        }
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Error fetching favorites from Firestore:", error);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchFavorites();
    return () => {
      active = false;
    };
  }, [user]);

  const handleRemoveFavorite = async (itemId: string | number) => {
    if (!user) return;
    const updatedFavorites = favorites.filter((fav) => fav.id !== itemId);
    setFavorites(updatedFavorites);
    try {
      const docRef = doc(db, "favorites", user.uid);
      await setDoc(docRef, { items: updatedFavorites }, { merge: true });
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Error removing favorite from Firestore:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    const matchesTab = activeTab === "All" || (activeTab === "READMEs" && fav.type === "README") || (activeTab === "Templates" && fav.type === "Template");
    const matchesSearch = fav.title.toLowerCase().includes(searchQuery.toLowerCase()) || fav.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Favourites</h1>
        <p className="text-gray-400">Your most used templates and pinned READMEs for quick access.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-white/5 pb-4">
        <div className="flex bg-[#09090B] border border-white/10 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search favorites..."
            className="block w-full sm:w-64 pl-9 pr-4 py-2 text-sm bg-[#09090B] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredFavorites.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={item.type === "README" ? `/dashboard/readme?id=${item.id}` : "/dashboard/templates"} className="block h-full">
                  <GlassCard hoverEffect className="group h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#7C3AED] to-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                            {item.type === "README" ? (
                              <FileCode2 className="w-5 h-5 text-[#22D3EE]" />
                            ) : (
                              <LayoutTemplate className="w-5 h-5 text-[#A855F7]" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-[#7C3AED] mb-0.5">{item.type}</div>
                            <h3 className="font-semibold text-white line-clamp-1" title={item.title}>{item.title}</h3>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFavorite(item.id);
                          }}
                          className="p-2 text-yellow-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative z-10" 
                          title="Remove from favorites"
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                      
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                        {item.description}
                      </p>
                      
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 mt-auto">
                        {item.type === "README" ? (
                          <span className="truncate max-w-[150px]" title={item.repo}>{item.repo}</span>
                        ) : (
                          <span>{item.uses} uses</span>
                        )}
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredFavorites.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500"
            >
              <Star className="w-12 h-12 mb-4 text-gray-600" />
              <p className="text-lg">No favorites found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
