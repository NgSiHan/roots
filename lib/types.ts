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
  completedActivities?: CompletedActivity[]; // Track completed activities with timestamps
  lastActivityDate?: string; // ISO date string of last completed activity
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

export type ActivityCategory = 'bonding' | 'fun' | 'learning' | 'health' | 'creative' | 'outdoor';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  duration: string; // e.g., "30 mins", "1-2 hours"
  tags: string[];
}

export interface CompletedActivity {
  activityId: string;
  completedAt: string; // ISO date string
  participantIds: string[]; // Which family members participated
}

export interface Photo {
  id: string;
  url: string; // placeholder for now
  caption: string;
  color: string; // For placeholder colored boxes
}

export interface Memory {
  id: string;
  title: string; // e.g., "Beach Day", "Theme Park Visit"
  date: string; // e.g., "July 15, 2024"
  photos: Photo[];
}

export interface Album {
  id: string;
  title: string; // e.g., "Summer Vacation 2024"
  description: string;
  coverColor: string; // For album cover
  lastUpdated: string; // e.g., "2 days ago"
  memories: Memory[]; // Contains individual memories
}

// Legacy type - keeping for backward compatibility
export interface MemoryCollection {
  id: string;
  title: string;
  photoCount: number;
  lastUpdated: string;
  photos: Photo[];
}

export interface CheckIn {
  id: string;
  personId: string;
  personName: string;
  mood: number; // 1-5
  emoji: string;
  note?: string;
  timestamp: string; // ISO date string
  treeId: string;
}

export interface PositiveMoment {
  id: string;
  activityName?: string;
  participantIds: string[]; // Who was involved
  date: string; // ISO date string
  emotionRating?: number; // 1-5
  notes?: string;
  photos: Photo[]; // Array of photos
  pointsEarned: number; // 1-5 based on details provided
  timestamp: string; // When it was logged
  treeId: string;
}

export interface AppState {
  activeFamilyTreeId: string;
  trees: FamilyTree[];
  activitySuggestions: Activity[];
  memoryCollections: Record<string, MemoryCollection[]>; // keyed by tree id - legacy
  albums: Record<string, Album[]>; // keyed by tree id - new structure
  lastExpandedMemory: Record<string, string | null>; // keyed by tree id
  lastExpandedAlbum: Record<string, string | null>; // keyed by tree id
  checkIns: CheckIn[]; // All check-ins across all trees
  notifications: CheckIn[]; // Recent check-ins to notify about
  positiveMoments: PositiveMoment[]; // All logged positive moments
}
