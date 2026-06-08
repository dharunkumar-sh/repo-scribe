import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GithubProfile, GithubRepo } from '@/lib/github';

interface GithubState {
  token: string | null;
  profile: GithubProfile | null;
  repos: GithubRepo[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string) => void;
  setProfile: (profile: GithubProfile) => void;
  setRepos: (repos: GithubRepo[]) => void;
  disconnect: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGithubStore = create<GithubState>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      repos: [],
      isConnected: false,
      isLoading: false,
      error: null,
      setToken: (token) => set({ token, isConnected: true }),
      setProfile: (profile) => set({ profile }),
      setRepos: (repos) => set({ repos }),
      disconnect: () => set({ token: null, profile: null, repos: [], isConnected: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
    }),
    {
      name: 'github-storage',
      // Persist token, isConnected, profile, and repos so data survives page refresh
      partialize: (state) => ({
        token: state.token,
        isConnected: state.isConnected,
        profile: state.profile,
        repos: state.repos,
      }),
    }
  )
);
