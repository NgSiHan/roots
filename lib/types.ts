/**
 * Core data types for ROOTS app
 */

export interface FamilyTree {
  id: string;
  name: string;
  description: string;
  treeScore: number; // 0-100 for Tree of Love
  members: Person[];
  activities: ActivityStats;
}

export interface Person {
  id: string;
  name: string;
  role: string; // e.g., "Dad", "Sibling", "Grandfather"
  birthYear?: number;
  generation: number; // Calculated based on distance from root person
  avatarColor: string; // For placeholder avatars
  initials: string;
  gender?: 'male' | 'female' | 'other'; // Gender for proper labels
  parentIds?: string[]; // IDs of parents (max 2)
  spouseId?: string; // ID of spouse/partner
}

export interface ActivityStats {
  completed: number;
  skipped: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface MemoryCollection {
  id: string;
  title: string;
  photoCount: number;
  lastUpdated: string;
  photos: Photo[];
}

export interface Photo {
  id: string;
  url: string; // placeholder for now
  caption: string;
  color: string; // For placeholder colored boxes
}

export interface AppState {
  activeFamilyTreeId: string;
  trees: FamilyTree[];
  activitySuggestions: Activity[];
  memoryCollections: Record<string, MemoryCollection[]>; // keyed by tree id
  lastExpandedMemory: Record<string, string | null>; // keyed by tree id
}
