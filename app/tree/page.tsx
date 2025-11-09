'use client';

import AnimatedPage from '@/components/AnimatedPage';
import LoveTree from '@/components/LoveTree';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

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
    albums: {},
    lastExpandedMemory: {},
    lastExpandedAlbum: {},
    checkIns: [],
    notifications: [],
  });

  const activeTree = appState.trees.find((t) => t.id === appState.activeFamilyTreeId);
  const treeScore = activeTree?.treeScore || 0;
  const memberCount = activeTree?.members.length || 0;

  // Calculate stats
  const memoriesShared = useMemo(() => {
    const collections = appState.memoryCollections[appState.activeFamilyTreeId] || [];
    return collections.reduce((sum, c) => sum + c.photoCount, 0);
  }, [appState.memoryCollections, appState.activeFamilyTreeId]);

  const activitiesCompleted = activeTree?.activities.completed || 0;

  // Mock data for days active - in real app would be calculated from timestamps
  const daysActive = 14;
  const checkInsThisWeek = 3;

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

  // Get stage description
  const getStageDescription = (score: number) => {
    if (score <= 20) return 'Your relationship is just beginning to take root. Every small moment matters!';
    if (score <= 40) return 'Growth is happening! Your connection is sprouting and showing promise.';
    if (score <= 60) return 'Your relationship is branching out beautifully. Keep nurturing it!';
    if (score <= 80) return 'Strong and mature! Your bond has grown deep and resilient.';
    return 'Flourishing together! Your relationship is bearing beautiful fruits of love and connection.';
  };

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main tree card */}
        <div className="bg-gradient-to-br from-white/70 to-sage/10 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200 mb-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-moss mb-2">Tree of Love</h1>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              {getStageDescription(treeScore)}
            </p>
          </div>

          {/* Tree visual */}
          <div className="mb-8">
            <LoveTree score={treeScore} />
          </div>

          {/* Score display */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-sage/30 to-moss/30 px-8 py-4 rounded-2xl shadow-md">
              <p className="text-sm text-gray-600 mb-1">Growth Level</p>
              <p className="text-3xl font-bold text-moss">{treeScore}/100</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-sage via-moss to-moss rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${treeScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {/* Demo controls */}
            <div className="flex gap-2">
              <button
                onClick={() => updateScore(-5)}
                disabled={treeScore <= 0}
                className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 transition-all hover:scale-110 active:scale-95 shadow-md"
                title="Decrease (Demo)"
              >
                −
              </button>
              <button
                onClick={() => updateScore(5)}
                disabled={treeScore >= 100}
                className="w-10 h-10 bg-moss/20 text-moss rounded-full font-bold hover:bg-moss/30 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 transition-all hover:scale-110 active:scale-95 shadow-md"
                title="Increase (Demo)"
              >
                +
              </button>
            </div>

            {/* Main action button */}
            <button
              onClick={() => updateScore(5)}
              disabled={treeScore >= 100}
              className="px-6 py-3 bg-gradient-to-r from-moss to-sage text-white rounded-xl font-semibold hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              Log a Positive Moment
            </button>

            {/* Reset button */}
            <button
              onClick={resetTree}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:shadow-md transition-all hover:scale-105 active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Family Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-sage/20 to-moss/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-moss"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{memberCount}</p>
              <p className="text-xs text-gray-600 font-medium">Family Members</p>
            </div>
          </motion.div>

          {/* Check-ins This Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{checkInsThisWeek}</p>
              <p className="text-xs text-gray-600 font-medium">Check-ins This Week</p>
            </div>
          </motion.div>

          {/* Memories Shared */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{memoriesShared}</p>
              <p className="text-xs text-gray-600 font-medium">Memories Shared</p>
            </div>
          </motion.div>

          {/* Days Active */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{daysActive}</p>
              <p className="text-xs text-gray-600 font-medium">Days Active</p>
            </div>
          </motion.div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Activities Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Activities Completed</h3>
                <p className="text-sm text-gray-600">Keep the momentum going!</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-sage/20 to-moss/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-moss"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This month</span>
                <span className="font-semibold text-moss">{activitiesCompleted}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-sage to-moss rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (activitiesCompleted / 10) * 100)}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-sand/50 to-terracotta/20 rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  className="w-6 h-6 text-terracotta"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ways to Grow Together</h3>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-moss mr-2">•</span>
                    <span>Share a meal and meaningful conversation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-moss mr-2">•</span>
                    <span>Try a new activity from the Activities tab</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-moss mr-2">•</span>
                    <span>Add photos to your memory collections</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
