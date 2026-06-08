export interface SavedReadme {
  id: string;
  title: string;
  description: string | null;
  markdown: string;
  repoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  collectionIds: string[];
}

export interface FavoriteItem {
  id: string | number;
  type: string;
  title: string;
  description: string;
  date: string;
  repo?: string;
  uses?: string;
}

export interface Collection {
  id: string | number;
  name: string;
  count: number;
  lastUpdated: string;
  color: string;
  iconColor: string;
}
