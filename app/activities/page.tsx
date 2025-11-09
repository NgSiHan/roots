'use client';

import AnimatedPage from '@/components/AnimatedPage';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState, Activity } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/**
 * Activities page - card stack of activity suggestions
 */
export default function ActivitiesPage() {
  const [appState, setAppState] = useLocalStorageState<AppState>('roots-app-state', {
    activeFamilyTreeId: initialTrees[0].id,
    trees: initialTrees,
    activitySuggestions,
    memoryCollections: memoryCollectionsData,
    lastExpandedMemory: {},
  });

  const activeTree = appState.trees.find((t) => t.id === appState.activeFamilyTreeId);
  const [remainingActivities, setRemainingActivities] = useState<Activity[]>(activitySuggestions);
  const [dismissDirection, setDismissDirection] = useState<'left' | 'right' | null>(null);

  const completed = activeTree?.activities.completed || 0;
  const skipped = activeTree?.activities.skipped || 0;

  const handleDismiss = (action: 'done' | 'skip') => {
    if (remainingActivities.length === 0) return;

    setDismissDirection(action === 'done' ? 'right' : 'left');

    // Update stats
    const updatedTrees = appState.trees.map((tree) => {
      if (tree.id === appState.activeFamilyTreeId) {
        return {
          ...tree,
          activities: {
            completed: action === 'done' ? tree.activities.completed + 1 : tree.activities.completed,
            skipped: action === 'skip' ? tree.activities.skipped + 1 : tree.activities.skipped,
          },
        };
      }
      return tree;
    });

    setAppState({ ...appState, trees: updatedTrees });

    // Remove top card after animation
    setTimeout(() => {
      setRemainingActivities((prev) => prev.slice(1));
      setDismissDirection(null);
    }, 300);
  };

  const resetActivities = () => {
    setRemainingActivities(activitySuggestions);
  };

  const topCard = remainingActivities[0];
  const cardStack = remainingActivities.slice(1, 4); // Show next 3 cards in stack

  return (
    <AnimatedPage>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-moss mb-2">This Week&apos;s Activities</h1>
          <p className="text-gray-600 text-sm">Strengthen your bond with these suggestions</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="px-4 py-2 bg-green-100 rounded-full">
            <span className="text-sm font-semibold text-green-700">
              Completed: {completed}
            </span>
          </div>
          <div className="px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm font-semibold text-gray-700">Skipped: {skipped}</span>
          </div>
        </div>

        {/* Card stack */}
        <div className="relative h-[450px] mb-8">
          {remainingActivities.length === 0 ? (
            // Empty state
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  All activities reviewed!
                </h3>
                <p className="text-gray-600 mb-6">
                  Great job going through all the suggestions.
                </p>
                <button
                  onClick={resetActivities}
                  className="px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95"
                >
                  Show Activities Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Background cards in stack */}
              {cardStack.map((activity, index) => (
                <div
                  key={activity.id}
                  className="absolute inset-x-0 mx-auto w-full max-w-md"
                  style={{
                    top: `${(index + 1) * 8}px`,
                    scale: `${1 - (index + 1) * 0.05}`,
                    opacity: 0.5 - index * 0.2,
                    zIndex: cardStack.length - index,
                  }}
                >
                  <div className="bg-white rounded-2xl shadow-lg h-[380px] border-2 border-gray-100" />
                </div>
              ))}

              {/* Top card */}
              <AnimatePresence>
                {topCard && (
                  <motion.div
                    key={topCard.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      x: dismissDirection === 'right' ? 500 : dismissDirection === 'left' ? -500 : 0,
                      rotate: dismissDirection === 'right' ? 20 : dismissDirection === 'left' ? -20 : 0,
                    }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-x-0 mx-auto w-full max-w-md"
                    style={{ zIndex: 100 }}
                  >
                    <div className="bg-gradient-to-br from-white to-sage/10 rounded-2xl shadow-xl p-8 border-2 border-sage/30 h-[380px] flex flex-col">
                      {/* Activity content */}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          {topCard.title}
                        </h2>
                        <p className="text-gray-600 mb-6">{topCard.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {topCard.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-sage/20 text-moss text-xs rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={() => handleDismiss('skip')}
                          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all hover:scale-105 active:scale-95"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => handleDismiss('done')}
                          className="flex-1 px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95 shadow-md"
                        >
                          ✓ Mark as Done
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Helper text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {remainingActivities.length > 0
              ? `${remainingActivities.length} ${remainingActivities.length === 1 ? 'activity' : 'activities'} remaining`
              : 'Come back next week for fresh suggestions!'}
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
