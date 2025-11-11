'use client';

import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { initialTrees } from '@/lib/seedData';
import { AppState } from '@/lib/types';

/**
 * Dropdown selector for switching between family trees
 */
export default function FamilyTreeSelector() {
  const [appState, setAppState] = useLocalStorageState<AppState>('roots-app-state', {
    activeFamilyTreeId: initialTrees[0].id,
    trees: initialTrees,
    activitySuggestions: [],
    memoryCollections: {},
    albums: {},
    lastExpandedMemory: {},
    lastExpandedAlbum: {},
    checkIns: [],
    notifications: [],
    positiveMoments: [],
    discardedPhotos: [],
  });

  const activeTree = appState.trees.find((t) => t.id === appState.activeFamilyTreeId);

  return (
    <select
      value={appState.activeFamilyTreeId}
      onChange={(e) => setAppState({ ...appState, activeFamilyTreeId: e.target.value })}
      className="bg-white/80 text-gray-800 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-white transition-colors cursor-pointer"
    >
      {appState.trees.map((tree) => (
        <option key={tree.id} value={tree.id}>
          {tree.name}
        </option>
      ))}
    </select>
  );
}
