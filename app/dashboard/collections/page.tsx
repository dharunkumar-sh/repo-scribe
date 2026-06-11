'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { Plus, Search, MoreVertical, FolderOpen, Trash2, Edit3, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

import { Collection } from "@/lib/types";
const themeOptions = [
  { name: "Cyan Spark", color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-cyan-400", bgClass: "bg-cyan-500" },
  { name: "Neon Violet", color: "from-purple-500/20 to-pink-500/20", iconColor: "text-pink-400", bgClass: "bg-pink-500" },
  { name: "Emerald Grass", color: "from-green-500/20 to-emerald-500/20", iconColor: "text-emerald-400", bgClass: "bg-emerald-500" },
  { name: "Solar Orange", color: "from-orange-500/20 to-red-500/20", iconColor: "text-orange-400", bgClass: "bg-orange-500" },
  { name: "Deep Indigo", color: "from-indigo-500/20 to-purple-500/20", iconColor: "text-indigo-400", bgClass: "bg-indigo-500" },
];

export default function CollectionsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionName, setCollectionName] = useState("");
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  
  // Menu dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | number | null>(null);

  useEffect(() => {
    let active = true;
    if (!user) {
      setCollections([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const colRef = doc(db, "collections", user.uid);
        const readmeRef = doc(db, "saved_readmes", user.uid);
        
        const [colSnap, readmeSnap] = await Promise.all([
          getDoc(colRef),
          getDoc(readmeRef)
        ]);

        let loadedCollections: Collection[] = [];
        let allReadmes: any[] = [];

        if (colSnap.exists()) {
          const data = colSnap.data();
          if (data && Array.isArray(data.items)) {
            loadedCollections = data.items;
          }
        }

        if (readmeSnap.exists()) {
          const data = readmeSnap.data();
          if (data && Array.isArray(data.items)) {
            allReadmes = data.items;
          }
        }

        if (active) {
          const mapped = loadedCollections.map(col => {
            const count = allReadmes.filter(r => 
              Array.isArray(r.collectionIds) && r.collectionIds.includes(String(col.id))
            ).length;
            return {
              ...col,
              count
            };
          });
          setCollections(mapped);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [user]);

  const saveToFirebase = async (newCollections: Collection[]) => {
    if (!user) return;
    try {
      const docRef = doc(db, "collections", user.uid);
      await setDoc(docRef, { items: newCollections }, { merge: true });
    } catch (error) {
      console.error("Failed to sync collections with database:", error);
      toast.error("Database sync failed");
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setCollectionName("");
    setSelectedThemeIndex(0);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (collection: Collection) => {
    setModalMode("edit");
    setSelectedCollection(collection);
    setCollectionName(collection.name);
    
    // Find theme option index
    const themeIdx = themeOptions.findIndex(t => t.color === collection.color) ?? 0;
    setSelectedThemeIndex(themeIdx >= 0 ? themeIdx : 0);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCollection(null);
    setCollectionName("");
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName.trim()) return;

    let updatedCollections = [...collections];
    const theme = themeOptions[selectedThemeIndex];

    if (modalMode === "create") {
      const newCollection: Collection = {
        id: Date.now(),
        name: collectionName.trim(),
        count: 0,
        lastUpdated: "Just now",
        color: theme.color,
        iconColor: theme.iconColor,
      };
      updatedCollections.push(newCollection);
      toast.success("Collection created successfully!");
    } else if (modalMode === "edit" && selectedCollection) {
      updatedCollections = collections.map((col) => 
        col.id === selectedCollection.id 
          ? { 
              ...col, 
              name: collectionName.trim(), 
              color: theme.color, 
              iconColor: theme.iconColor,
              lastUpdated: "Just now" 
            }
          : col
      );
      toast.success("Collection updated!");
    }

    setCollections(updatedCollections);
    if (user) await saveToFirebase(updatedCollections);
    handleCloseModal();
  };

  const handleDeleteCollection = async (id: string | number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this collection?");
    if (!confirmDelete) return;

    const updatedCollections = collections.filter((col) => col.id !== id);
    setCollections(updatedCollections);
    if (user) await saveToFirebase(updatedCollections);
    toast.success("Collection deleted");
    setActiveMenuId(null);
  };

  const filteredCollections = collections.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Collections</h1>
          <p className="text-gray-400">Organize your READMEs and templates into custom folders.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Collection
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search collections..."
          className="block w-full max-w-md pl-11 pr-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                <Link href={`/dashboard/collections/${collection.id}`} className="block h-full">
                  <GlassCard hoverEffect className="group cursor-pointer relative overflow-hidden h-full flex flex-col justify-between">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${collection.color} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity rounded-full -mr-10 -mt-10`} />
                    
                    <div className="p-6 flex flex-col h-full relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${collection.iconColor}`}>
                          <FolderOpen className="w-6 h-6" />
                        </div>
                        
                        {/* Custom dropdown menu */}
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === collection.id ? null : collection.id);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white relative z-20"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          <AnimatePresence>
                            {activeMenuId === collection.id && (
                              <>
                                <div className="fixed inset-0 z-20" onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                }} />
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute right-0 mt-1 w-36 bg-[#09090B] border border-white/10 rounded-xl shadow-2xl p-1 z-30"
                                >
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleOpenEditModal(collection);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" /> Rename
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteCollection(collection.id);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-[#7C3AED] transition-colors">{collection.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{collection.count} {collection.count === 1 ? 'item' : 'items'}</p>
                      
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                        <span>Updated {collection.lastUpdated}</span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredCollections.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500">
              No collections found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {/* Modern Dialog Modal for Create / Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#09090B]/80 backdrop-blur-md" 
              onClick={handleCloseModal} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#09090B] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">
                  {modalMode === "create" ? "Create Collection" : "Rename Collection"}
                </h2>
                <button onClick={handleCloseModal} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCollection} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Collection Name</label>
                  <input
                    type="text"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    placeholder="e.g. My Favorite React Apps"
                    className="block w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all outline-none"
                    required
                    maxLength={32}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Card Accent Color</label>
                  <div className="flex gap-3">
                    {themeOptions.map((theme, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedThemeIndex(i)}
                        className={`w-8 h-8 rounded-full transition-all border flex items-center justify-center ${theme.bgClass} ${
                          selectedThemeIndex === i ? "scale-110 border-white ring-2 ring-[#7C3AED]" : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        title={theme.name}
                      >
                        {selectedThemeIndex === i && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-all"
                  >
                    {modalMode === "create" ? "Create" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
