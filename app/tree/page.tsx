'use client';

import AnimatedPage from '@/components/AnimatedPage';
import LoveTree from '@/components/LoveTree';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';

/**
 * Tree of Love page
 * Shows a visual tree that grows based on relationship closeness score (0-100)
 */
export default function TreePage() {
  const [appState, setAppState] = useLocalStorageState<AppState>('roots-app-state', {
    activeFamilyTreeId: initialTrees[0].id,
    trees: initialTrees,
    activitySuggestions,
    memoryCollections: memoryCollectionsData,
    lastExpandedMemory: {},
  });

  const activeTree = appState.trees.find((t) => t.id === appState.activeFamilyTreeId);
  const treeScore = activeTree?.treeScore || 0;

  // Update tree score
  const updateScore = (delta: number) => {
    if (!activeTree) return;

    const newScore = Math.max(0, Math.min(100, treeScore + delta));
    const updatedTrees = appState.trees.map((tree) =>
      tree.id === appState.activeFamilyTreeId ? { ...tree, treeScore: newScore } : tree
    );

    setAppState({ ...appState, trees: updatedTrees });
  };

  const resetTree = () => {
    const updatedTrees = appState.trees.map((tree) =>
      tree.id === appState.activeFamilyTreeId ? { ...tree, treeScore: 0 } : tree
    );
    setAppState({ ...appState, trees: updatedTrees });
  };

  return (
    <AnimatedPage>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-moss mb-2">Tree of Love</h1>
            <p className="text-gray-600 text-sm">
              Each time you listen, share, or do something together, your tree grows.
            </p>
          </div>

          {/* Tree visual */}
          <div className="mb-8">
            <LoveTree score={treeScore} />
          </div>

          {/* Score display */}
          <div className="text-center mb-6">
            <div className="inline-block bg-sage/20 px-6 py-3 rounded-full">
              <p className="text-lg font-semibold text-gray-700">
                Growth Level: <span className="text-moss font-bold">{treeScore}/100</span>
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sage to-moss rounded-full transition-all duration-500 ease-out"
                style={{ width: `${treeScore}%` }}
              />
            </div>
          </div>

          {/* Stage info */}
          <div className="text-center mb-8 text-sm text-gray-600">
            {treeScore <= 20 && (
              <p>🌱 Your tree is just starting to grow. Keep nurturing your relationship!</p>
            )}
            {treeScore > 20 && treeScore <= 60 && (
              <p>🌿 Your tree is growing strong. Keep up the great bonding moments!</p>
            )}
            {treeScore > 60 && (
              <p>🌳 Your tree is thriving! Your relationship is flourishing beautifully.</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => updateScore(5)}
              disabled={treeScore >= 100}
              className="px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              ✨ Log a Positive Moment (+5)
            </button>
            <button
              onClick={resetTree}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              🔄 Reset Tree
            </button>
          </div>

          {/* Helper text */}
          <div className="mt-8 p-4 bg-sand/30 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              <strong>Tip:</strong> Regular family activities, deep conversations, and quality time
              together all help your tree grow. Check the Activities tab for suggestions!
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
