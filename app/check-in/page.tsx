'use client';

import AnimatedPage from '@/components/AnimatedPage';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState, CheckIn } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData, albumsData } from '@/lib/seedData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

// Mood emoji mapping
const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
const moodLabels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
const moodColors = ['#EF4444', '#F59E0B', '#6B7280', '#10B981', '#059669'];

/**
 * Check-In page - Emotion tracking and family updates
 */
export default function CheckInPage() {
  const [appState, setAppState] = useLocalStorageState<AppState>('roots-app-state', {
    activeFamilyTreeId: initialTrees[0].id,
    trees: initialTrees,
    activitySuggestions,
    memoryCollections: memoryCollectionsData,
    albums: albumsData || {},
    lastExpandedMemory: {},
    lastExpandedAlbum: {},
    checkIns: [],
    notifications: [],
  });

  const activeTree = appState.trees.find((t) => t.id === appState.activeFamilyTreeId);
  const [mood, setMood] = useState(3); // Default to neutral
  const [note, setNote] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState<string>(
    activeTree?.members[0]?.id || ''
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get check-ins for current tree
  const treeCheckIns = useMemo(() => {
    return (appState.checkIns || [])
      .filter((c) => c.treeId === appState.activeFamilyTreeId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [appState.checkIns, appState.activeFamilyTreeId]);

  // Get recent notifications (last 24 hours, exclude own check-ins)
  const recentNotifications = useMemo(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return (appState.notifications || [])
      .filter((n) => {
        const timestamp = new Date(n.timestamp).getTime();
        return timestamp > oneDayAgo && n.treeId === appState.activeFamilyTreeId;
      })
      .slice(0, 3); // Show max 3 notifications
  }, [appState.notifications, appState.activeFamilyTreeId]);

  const handleSubmit = () => {
    if (!selectedPersonId) return;

    const selectedPerson = activeTree?.members.find((m) => m.id === selectedPersonId);
    if (!selectedPerson) return;

    const newCheckIn: CheckIn = {
      id: `checkin-${Date.now()}`,
      personId: selectedPersonId,
      personName: selectedPerson.name,
      mood,
      emoji: moodEmojis[mood - 1],
      note: note.trim() || undefined,
      timestamp: new Date().toISOString(),
      treeId: appState.activeFamilyTreeId,
    };

    // Add to check-ins and notifications
    setAppState({
      ...appState,
      checkIns: [newCheckIn, ...(appState.checkIns || [])],
      notifications: [newCheckIn, ...(appState.notifications || [])],
    });

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Reset form
    setMood(3);
    setNote('');
  };

  const dismissNotification = (id: string) => {
    setAppState({
      ...appState,
      notifications: (appState.notifications || []).filter((n) => n.id !== id),
    });
  };

  if (!mounted) {
    return (
      <AnimatedPage>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-moss mb-2">Check-In</h1>
            <p className="text-gray-600 text-sm">How are you feeling today?</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-moss mb-2">Check-In</h1>
          <p className="text-gray-600 text-sm">Share how you&apos;re feeling with your family</p>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {recentNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{notification.emoji}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {notification.personName} checked in
                    </p>
                    <p className="text-sm text-gray-600">
                      Feeling {moodLabels[notification.mood - 1].toLowerCase()}
                    </p>
                    {notification.note && (
                      <p className="text-sm text-gray-700 mt-1 italic">&quot;{notification.note}&quot;</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Check-In Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-white via-sage/5 to-sage/10 rounded-2xl shadow-xl p-8 mb-8 border-2 border-sage/30"
        >
          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-green-500/90 rounded-2xl flex items-center justify-center z-50"
              >
                <div className="text-center text-white">
                  <div className="text-6xl mb-2">✓</div>
                  <p className="text-xl font-bold">Check-in saved!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Person Selector */}
          {activeTree && activeTree.members.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Checking in as:
              </label>
              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors text-gray-800 font-medium"
              >
                {activeTree.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mood Emoji Display */}
          <div className="text-center mb-6">
            <motion.div
              key={mood}
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-9xl mb-4"
              style={{ color: moodColors[mood - 1] }}
            >
              {moodEmojis[mood - 1]}
            </motion.div>
            <p className="text-2xl font-bold text-gray-800">{moodLabels[mood - 1]}</p>
          </div>

          {/* Mood Slider */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              How are you feeling?
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right,
                  #EF4444 0%,
                  #F59E0B 25%,
                  #6B7280 50%,
                  #10B981 75%,
                  #059669 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {moodEmojis.map((emoji, index) => (
                <span key={index} className="text-xl">
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Share what's on your mind..."
              rows={3}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-4 bg-moss text-white rounded-xl font-bold text-lg hover:bg-moss/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Submit Check-In
          </button>
        </motion.div>

        {/* Check-In History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Check-In History</h2>

          {treeCheckIns.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600">No check-ins yet</p>
              <p className="text-sm text-gray-500 mt-1">Be the first to share how you&apos;re feeling!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {treeCheckIns.map((checkIn, index) => (
                <motion.div
                  key={checkIn.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4"
                  style={{ borderLeftColor: moodColors[checkIn.mood - 1] }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{checkIn.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-gray-800">{checkIn.personName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(checkIn.timestamp).toLocaleDateString()} at{' '}
                          {new Date(checkIn.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Feeling {moodLabels[checkIn.mood - 1].toLowerCase()}
                      </p>
                      {checkIn.note && (
                        <p className="text-sm text-gray-700 italic mt-2 p-2 bg-gray-50 rounded">
                          &quot;{checkIn.note}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
