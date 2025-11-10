'use client';

import AnimatedPage from '@/components/AnimatedPage';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Starred Logs Page
 * Shows all logs that have been starred by the user
 */
export default function StarredPage() {
  const [appState] = useLocalStorageState<AppState>('roots-app-state', {
    activeFamilyTreeId: initialTrees[0].id,
    trees: initialTrees,
    activitySuggestions,
    memoryCollections: memoryCollectionsData,
    albums: {},
    lastExpandedMemory: {},
    lastExpandedAlbum: {},
    checkIns: [],
    notifications: [],
    positiveMoments: [],
  });

  const [mounted, setMounted] = useState(false);

  useState(() => {
    setMounted(true);
  });

  const activeTree = appState.trees.find((t) => t.id === appState.activeFamilyTreeId);

  // Get all starred logs for the active tree, sorted by date (newest first)
  const starredLogs = useMemo(() => {
    return (appState.positiveMoments || [])
      .filter((log) => log.treeId === appState.activeFamilyTreeId && log.starred)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [appState.positiveMoments, appState.activeFamilyTreeId]);

  // Get participant names for a log
  const getParticipantNames = (participantIds: string[]) => {
    if (!activeTree) return [];
    return participantIds
      .map((id) => activeTree.members.find((m) => m.id === id)?.name)
      .filter(Boolean) as string[];
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-peach via-white to-sky py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-moss mb-2"
            >
              ⭐ Starred Moments
            </motion.h1>
            <p className="text-gray-600">
              Your favorite memories marked with a star
            </p>
          </div>

          {/* Starred count */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <div className="inline-block bg-gradient-to-r from-amber-100 to-yellow-100 px-6 py-3 rounded-full shadow-md">
                <p className="text-lg font-semibold text-amber-800">
                  {starredLogs.length} Starred {starredLogs.length === 1 ? 'Moment' : 'Moments'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Starred logs list */}
          {mounted && starredLogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 text-6xl mb-4">⭐</div>
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Starred Moments Yet</h2>
              <p className="text-gray-500">
                Click on any element in your tree to view details and star your favorite moments!
              </p>
            </motion.div>
          )}

          {mounted && starredLogs.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {starredLogs.map((log, index) => {
                const participants = getParticipantNames(log.participantIds);
                const formattedDate = new Date(log.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-amber-200"
                  >
                    {/* Star indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">⭐</span>
                      <h3 className="text-xl font-bold text-moss">
                        {log.activityName || 'Positive Moment'}
                      </h3>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formattedDate}</span>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{participants.join(', ')}</span>
                    </div>

                    {/* Emotion rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">Feeling:</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-lg">
                            {i < log.emotionRating ? '😊' : '😐'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {log.notes && (
                      <div className="bg-gradient-to-r from-sage/10 to-moss/10 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 italic">"{log.notes}"</p>
                      </div>
                    )}

                    {/* Photos count */}
                    {log.photos.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{log.photos.length} {log.photos.length === 1 ? 'photo' : 'photos'}</span>
                      </div>
                    )}

                    {/* Points earned */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <span className="text-sm font-semibold text-moss">
                        +{log.pointsEarned} points earned
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Back button */}
          <div className="mt-8 text-center">
            <a
              href="/tree"
              className="inline-block px-6 py-3 bg-gradient-to-r from-moss to-sage text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              ← Back to Tree
            </a>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
