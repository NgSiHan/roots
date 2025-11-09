'use client';

import AnimatedPage from '@/components/AnimatedPage';
import PersonCard from '@/components/PersonCard';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState, Person } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { useMemo } from 'react';

/**
 * Family Tree page - genealogy chart view
 * Shows family members organized by generation with connecting lines
 */
export default function FamilyTreePage() {
  const [appState] = useLocalStorageState<AppState>('roots-app-state', {
    activeFamilyTreeId: initialTrees[0].id,
    trees: initialTrees,
    activitySuggestions,
    memoryCollections: memoryCollectionsData,
    lastExpandedMemory: {},
  });

  const activeTree = appState.trees.find((t) => t.id === appState.activeFamilyTreeId);
  const members = activeTree?.members || [];

  // Group members by generation
  const generationGroups = useMemo(() => {
    const groups: Record<number, Person[]> = {};
    members.forEach((person) => {
      if (!groups[person.generation]) {
        groups[person.generation] = [];
      }
      groups[person.generation].push(person);
    });
    return groups;
  }, [members]);

  // Get generation labels
  const getGenerationLabel = (generation: number): string => {
    const maxGen = Math.max(...members.map((m) => m.generation));
    if (generation === 0) {
      return maxGen > 1 ? 'Grandparents' : 'Parents';
    }
    if (generation === 1) {
      return maxGen > 1 ? 'Parents' : 'Children';
    }
    if (generation === 2) {
      return maxGen > 2 ? 'You & Siblings' : 'Children';
    }
    return 'Children';
  };

  const generations = Object.keys(generationGroups)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-moss mb-2">Family Tree</h1>
          <p className="text-gray-600 text-sm">
            {activeTree?.description || 'Your family connections'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Tap on a person to see their details</p>
        </div>

        {/* Family tree diagram */}
        <div className="bg-gradient-to-br from-cream/50 to-sand/50 rounded-3xl shadow-xl p-8 border border-gray-200 overflow-x-auto">
          <div className="space-y-12 min-w-max">
            {generations.map((generation, idx) => {
              const people = generationGroups[generation];
              return (
                <div key={generation} className="relative">
                  {/* Generation label */}
                  <div className="text-center mb-4">
                    <span className="inline-block px-4 py-2 bg-white rounded-full shadow-sm text-sm font-semibold text-gray-700">
                      {getGenerationLabel(generation)}
                    </span>
                  </div>

                  {/* People in this generation */}
                  <div className="flex justify-center items-center gap-8 flex-wrap">
                    {people.map((person) => (
                      <PersonCard key={person.id} person={person} />
                    ))}
                  </div>

                  {/* Connecting line to next generation */}
                  {idx < generations.length - 1 && (
                    <div className="flex justify-center mt-6">
                      <svg width="2" height="40" className="opacity-30">
                        <line
                          x1="1"
                          y1="0"
                          x2="1"
                          y2="40"
                          stroke="#7A9B76"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info card */}
        <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            About {activeTree?.name || 'This Tree'}
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Members:</strong> {members.length} people
            </p>
            <p>
              <strong>Generations:</strong> {generations.length}
            </p>
            <p className="text-xs mt-4 text-gray-500">
              💡 Switch between your family trees using the dropdown in the header
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
