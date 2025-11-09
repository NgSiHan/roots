'use client';

import AnimatedPage from '@/components/AnimatedPage';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState, Activity, ActivityCategory, CompletedActivity, Person } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';

type FilterType = 'all' | 'completed' | ActivityCategory;

// Category badge colors - with validation
const categoryColors: Record<ActivityCategory, { bg: string; text: string; border: string }> = {
  bonding: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  fun: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  learning: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  health: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  creative: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  outdoor: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
};

// Helper to get category colors safely
function getCategoryColors(category: ActivityCategory) {
  return categoryColors[category] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
}

/**
 * Activities page - interactive cards with note-like aesthetics
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
  const [filter, setFilter] = useState<FilterType>('all');
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [dismissDirection, setDismissDirection] = useState<'left' | 'right' | null>(null);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [showInactivityPrompt, setShowInactivityPrompt] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for inactivity (>7 days since last activity)
  useEffect(() => {
    if (!mounted) return;

    if (!activeTree?.lastActivityDate) {
      // Never completed an activity, show prompt
      setShowInactivityPrompt(true);
      return;
    }

    const lastActivity = new Date(activeTree.lastActivityDate);
    const daysSince = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSince > 7) {
      setShowInactivityPrompt(true);
    }
  }, [activeTree?.lastActivityDate, mounted]);

  // Get completed activity IDs
  const completedActivityIds = useMemo(() => {
    return new Set(activeTree?.completedActivities?.map(ca => ca.activityId) || []);
  }, [activeTree?.completedActivities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    let activities = appState.activitySuggestions;

    if (filter === 'completed') {
      activities = activities.filter(a => completedActivityIds.has(a.id));
    } else if (filter !== 'all') {
      activities = activities.filter(a => a.category === filter);
      // Exclude completed activities when filtering by category
      activities = activities.filter(a => !completedActivityIds.has(a.id));
    } else {
      // For 'all', show only non-completed activities
      activities = activities.filter(a => !completedActivityIds.has(a.id));
    }

    return activities;
  }, [appState.activitySuggestions, filter, completedActivityIds]);

  const handleComplete = (activityId: string) => {
    setDismissingId(activityId);
    setDismissDirection('right');

    setTimeout(() => {
      const updatedTrees = appState.trees.map((tree) => {
        if (tree.id === appState.activeFamilyTreeId) {
          const completedActivity: CompletedActivity = {
            activityId,
            completedAt: new Date().toISOString(),
            participantIds: tree.members.map(m => m.id),
          };

          return {
            ...tree,
            activities: {
              ...tree.activities,
              completed: tree.activities.completed + 1,
            },
            completedActivities: [...(tree.completedActivities || []), completedActivity],
            lastActivityDate: new Date().toISOString(),
          };
        }
        return tree;
      });

      setAppState({ ...appState, trees: updatedTrees });
      setDismissingId(null);
      setDismissDirection(null);
      setShowInactivityPrompt(false);
    }, 400);
  };

  const handleSkip = (activityId: string) => {
    setDismissingId(activityId);
    setDismissDirection('left');

    setTimeout(() => {
      const updatedTrees = appState.trees.map((tree) => {
        if (tree.id === appState.activeFamilyTreeId) {
          return {
            ...tree,
            activities: {
              ...tree.activities,
              skipped: tree.activities.skipped + 1,
            },
          };
        }
        return tree;
      });

      setAppState({ ...appState, trees: updatedTrees });
      setDismissingId(null);
      setDismissDirection(null);
    }, 400);
  };

  const completed = activeTree?.activities.completed || 0;
  const skipped = activeTree?.activities.skipped || 0;

  if (!mounted) {
    // Render placeholder to prevent hydration mismatch
    return (
      <AnimatedPage>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-moss mb-2">Family Activities</h1>
            <p className="text-gray-600 text-sm">Strengthen your bond with these suggestions</p>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-green-100 rounded-full">
                <span className="text-sm font-semibold text-green-700">✓ 0</span>
              </div>
              <div className="px-4 py-2 bg-gray-100 rounded-full">
                <span className="text-sm font-semibold text-gray-700">Skip: 0</span>
              </div>
            </div>
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
          <h1 className="text-3xl font-bold text-moss mb-2">Family Activities</h1>
          <p className="text-gray-600 text-sm">Strengthen your bond with these suggestions</p>
        </div>

        {/* Stats & Propose Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-green-100 rounded-full">
              <span className="text-sm font-semibold text-green-700">
                ✓ {completed}
              </span>
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-full">
              <span className="text-sm font-semibold text-gray-700">Skip: {skipped}</span>
            </div>
          </div>
          <button
            onClick={() => setShowProposeModal(true)}
            className="px-5 py-2.5 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            + Propose Activity
          </button>
        </div>

        {/* Smart Family Prompt for Inactivity */}
        <AnimatePresence>
          {showInactivityPrompt && filter === 'all' && filteredActivities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">
                    Time for some family bonding!
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    It&apos;s been a while since your last activity. How about trying one today?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowInactivityPrompt(false)}
                      className="px-4 py-2 bg-moss text-white rounded-lg font-medium hover:bg-moss/90 transition-all text-sm"
                    >
                      Let&apos;s do it!
                    </button>
                    <button
                      onClick={() => setShowInactivityPrompt(false)}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm border border-gray-300"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterPill>
          <FilterPill active={filter === 'completed'} onClick={() => setFilter('completed')}>
            Completed
          </FilterPill>
          <FilterPill active={filter === 'bonding'} onClick={() => setFilter('bonding')}>
            Bonding
          </FilterPill>
          <FilterPill active={filter === 'fun'} onClick={() => setFilter('fun')}>
            Fun
          </FilterPill>
          <FilterPill active={filter === 'learning'} onClick={() => setFilter('learning')}>
            Learning
          </FilterPill>
          <FilterPill active={filter === 'health'} onClick={() => setFilter('health')}>
            Health
          </FilterPill>
          <FilterPill active={filter === 'creative'} onClick={() => setFilter('creative')}>
            Creative
          </FilterPill>
          <FilterPill active={filter === 'outdoor'} onClick={() => setFilter('outdoor')}>
            Outdoor
          </FilterPill>
        </div>

        {/* Activities List */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {filter === 'completed' ? '🎉' : '🤔'}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filter === 'completed'
                ? 'No completed activities yet'
                : 'No activities in this category'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'completed'
                ? 'Complete some activities to see them here!'
                : 'Try selecting a different category.'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all"
              >
                View All Activities
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={index}
                  onComplete={handleComplete}
                  onSkip={handleSkip}
                  isDismissing={dismissingId === activity.id}
                  dismissDirection={dismissingId === activity.id ? dismissDirection : null}
                  isCompleted={completedActivityIds.has(activity.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Propose Activity Modal */}
        <ProposeActivityModal
          isOpen={showProposeModal}
          onClose={() => setShowProposeModal(false)}
          familyMembers={activeTree?.members || []}
          onPropose={(newActivity) => {
            setAppState({
              ...appState,
              activitySuggestions: [...appState.activitySuggestions, newActivity],
            });
            setShowProposeModal(false);
          }}
        />
      </div>
    </AnimatedPage>
  );
}

// Filter Pill Component
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
        active
          ? 'bg-moss text-white shadow-md scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

// Activity Card Component with note-like aesthetics
function ActivityCard({
  activity,
  index,
  onComplete,
  onSkip,
  isDismissing,
  dismissDirection,
  isCompleted,
}: {
  activity: Activity;
  index: number;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  isDismissing: boolean;
  dismissDirection: 'left' | 'right' | null;
  isCompleted: boolean;
}) {
  const colors = getCategoryColors(activity.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, rotate: 0 }}
      animate={{
        opacity: isDismissing ? 0 : 1,
        y: 0,
        x: isDismissing ? (dismissDirection === 'right' ? 500 : -500) : 0,
        rotate: isDismissing
          ? (dismissDirection === 'right' ? 15 : -15)
          : index % 2 === 0 ? -0.5 : 0.5, // Slight slant alternating
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: isDismissing ? 0.4 : 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="relative"
    >
      <div
        className={`
          bg-gradient-to-br from-white to-yellow-50/30
          rounded-lg shadow-lg hover:shadow-xl
          border-l-4 ${colors.border}
          p-6 transition-all
          ${!isCompleted ? 'hover:scale-[1.02]' : ''}
          ${isCompleted ? 'opacity-60' : ''}
        `}
        style={{
          boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.1)',
        }}
      >
        {/* Category Badge & Duration */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${colors.bg} ${colors.text} border ${colors.border}
            `}
          >
            {activity.category}
          </span>
          <span className="text-sm text-gray-600 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {activity.duration}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{activity.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {activity.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-sage/20 text-moss text-xs rounded-md font-medium border border-sage/30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        {!isCompleted && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onSkip(activity.id)}
              className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 border border-gray-300"
            >
              Skip
            </button>
            <button
              onClick={() => onComplete(activity.id)}
              className="flex-1 px-5 py-2.5 bg-moss text-white rounded-lg font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              ✓ Complete
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Completed
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Propose Activity Modal Component
function ProposeActivityModal({
  isOpen,
  onClose,
  familyMembers,
  onPropose,
}: {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: Person[];
  onPropose: (activity: Activity) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('bonding');
  const [duration, setDuration] = useState('1 hour');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      duration,
      tags: ['Custom', ...Array.from(selectedMembers).slice(0, 2)],
    };

    onPropose(newActivity);

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('bonding');
    setDuration('1 hour');
    setSelectedMembers(new Set());
  };

  const toggleMember = (memberId: string) => {
    const newSet = new Set(selectedMembers);
    if (newSet.has(memberId)) {
      newSet.delete(memberId);
    } else {
      newSet.add(memberId);
    }
    setSelectedMembers(newSet);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Propose Activity</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Family Karaoke Night"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the activity..."
                  rows={3}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors"
                >
                  <option value="bonding">Bonding</option>
                  <option value="fun">Fun</option>
                  <option value="learning">Learning</option>
                  <option value="health">Health</option>
                  <option value="creative">Creative</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 1-2 hours"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors"
                />
              </div>

              {/* Tag Family Members */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tag Family Members (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {familyMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => toggleMember(member.id)}
                      className={`
                        px-3 py-2 rounded-lg font-medium text-sm transition-all
                        ${selectedMembers.has(member.id)
                          ? 'bg-moss text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      {member.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !description.trim()}
                className="flex-1 px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Propose Activity
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
