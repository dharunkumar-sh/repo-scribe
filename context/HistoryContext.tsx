"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

export type ActivityType = "generate" | "github_connect" | "edit_template" | "collection_add" | "favourite" | "other";
export type ActivityStatus = "success" | "default" | "accent" | "warning" | "error";

export interface ActivityItem {
  id: string;
  userId: string;
  title: string;
  type: ActivityType;
  status: ActivityStatus;
  read: boolean;
  link?: string;
  createdAt: any;
}

interface HistoryContextType {
  activities: ActivityItem[];
  loading: boolean;
  error: Error | null;
  addActivity: (title: string, type: ActivityType, status?: ActivityStatus, link?: string) => Promise<void>;
  markAsRead: (activityId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Use a per-user subcollection: users/{uid}/activities
    // This avoids the need for a composite index on (userId + createdAt)
    const activitiesRef = collection(db, "users", user.uid, "activities");
    const q = query(activitiesRef, orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const activityData = snapshot.docs.map((doc) => ({
          id: doc.id,
          userId: user.uid,
          read: false,
          ...doc.data(),
        })) as ActivityItem[];
        setActivities(activityData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching activities:", err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addActivity = async (title: string, type: ActivityType, status: ActivityStatus = "default", link?: string) => {
    if (!user) return;
    try {
      const activitiesRef = collection(db, "users", user.uid, "activities");
      await addDoc(activitiesRef, {
        userId: user.uid,
        title,
        type,
        status,
        read: false,
        link: link || null,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error adding activity:", err);
    }
  };

  const markAsRead = async (activityId: string) => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid, "activities", activityId);
      await updateDoc(docRef, { read: true });
    } catch (err) {
      console.error("Error marking activity as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const batch = writeBatch(db);
      let hasUpdates = false;

      activities.forEach((activity) => {
        if (!activity.read) {
          const docRef = doc(db, "users", user.uid, "activities", activity.id);
          batch.update(docRef, { read: true });
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        await batch.commit();
      }
    } catch (err) {
      console.error("Error marking all activities as read:", err);
    }
  };

  return (
    <HistoryContext.Provider value={{ activities, loading, error, addActivity, markAsRead, markAllAsRead }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}
