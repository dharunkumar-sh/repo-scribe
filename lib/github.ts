// Utility functions for interacting with GitHub REST and GraphQL APIs

const GITHUB_API_URL = "https://api.github.com";

export interface GithubProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
  visibility: string;
  updated_at: string;
  topics: string[];
  license: {
    key: string;
    name: string;
  } | null;
}

export const fetchGithubProfile = async (token: string, signal?: AbortSignal): Promise<GithubProfile> => {
  const response = await fetch(`${GITHUB_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub profile");
  }

  return response.json();
};

export const fetchGithubRepos = async (token: string, signal?: AbortSignal): Promise<GithubRepo[]> => {
  const response = await fetch(`${GITHUB_API_URL}/user/repos?sort=updated&per_page=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub repositories");
  }

  return response.json();
};

// We will add more specific functions here (GraphQL for heatmaps, etc.) later.
