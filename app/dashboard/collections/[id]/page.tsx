"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { GlassCard } from "../../components/ui/GlassCard";
import { Collection } from "@/lib/types";
import { SavedReadme } from "@/lib/types";
import { ArrowLeft, FolderOpen, FileCode2, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [readmes, setReadmes] = useState<SavedReadme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    let active = true;

    const fetchData = async () => {
      try {
        // Fetch collection info
        const colRef = doc(db, "collections", user.uid);
        const colSnap = await getDoc(colRef);
        if (colSnap.exists()) {
          const items: Collection[] = colSnap.data().items || [];
          const found = items.find((c) => String(c.id) === String(id));
          if (active) {
            if (found) setCollection(found);
            else {
              toast.error("Collection not found.");
              router.replace("/dashboard/collections");
              return;
            }
          }
        }

        // Fetch readmes that belong to this collection
        const readmeRef = doc(db, "saved_readmes", user.uid);
        const readmeSnap = await getDoc(readmeRef);
        if (active && readmeSnap.exists()) {
          const allReadmes: SavedReadme[] = readmeSnap.data().items || [];
          const filtered = allReadmes.filter((r) =>
            Array.isArray(r.collectionIds) && r.collectionIds.includes(String(id))
          );
          setReadmes(filtered);
        }
      } catch (err) {
        console.error("Error loading collection:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchData();
    return () => { active = false; };
  }, [user, id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Collections
      </button>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${collection.iconColor}`}>
          <FolderOpen className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{collection.name}</h1>
          <p className="text-gray-400 mt-1">
            {readmes.length} {readmes.length === 1 ? "README" : "READMEs"} · Updated {collection.lastUpdated}
          </p>
        </div>
      </div>

      {/* READMEs grid */}
      {readmes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <FileCode2 className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg mb-1">No READMEs in this collection yet</p>
          <p className="text-gray-600 text-sm">Generate a README and save it to this collection.</p>
          <Link
            href="/dashboard/generate"
            className="mt-6 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
          >
            Generate README
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {readmes.map((readme, i) => (
            <motion.div
              key={readme.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard/readme?id=${readme.id}`}>
                <GlassCard hoverEffect className="p-5 group flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        <FileCode2 className="w-5 h-5 text-[#22D3EE]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-[#A855F7] transition-colors line-clamp-1">
                          {readme.title}
                        </h3>
                        {readme.repoUrl && (
                          <span className="text-xs text-gray-500 truncate max-w-[200px] block">
                            {readme.repoUrl.replace("https://github.com/", "")}
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 mt-1" />
                  </div>
                  {readme.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">{readme.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-auto pt-2 border-t border-white/5">
                    <Calendar className="w-3 h-3" />
                    {readme.createdAt
                      ? formatDistanceToNow(new Date(readme.createdAt), { addSuffix: true })
                      : "Unknown date"}
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
