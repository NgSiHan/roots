'use client';

import AnimatedPage from '@/components/AnimatedPage';
import LoveTree from '@/components/LoveTree';
import LogDetailModal from '@/components/LogDetailModal';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState, PositiveMoment, Photo } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

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
    positiveMoments: [],
  });

  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  // Modal form state
  const [activityName, setActivityName] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [additionalPeople, setAdditionalPeople] = useState('');
  const [momentDate, setMomentDate] = useState(new Date().toISOString().split('T')[0]);
  const [emotionRating, setEmotionRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTree = appState.trees.find((t) => t.id === appState.activeFamilyTreeId);
  const treeScore = activeTree?.treeScore || 0;
  const logCount = activeTree?.logCount || 0;
  const memberCount = activeTree?.members.length || 0;

  // Calculate tree stage based on log count
  const getTreeStage = (logs: number) => {
    if (logs < 10) return { name: 'Seed', progress: logs, max: 10 };
    if (logs < 20) return { name: 'Sprout', progress: logs - 10, max: 10 };
    if (logs < 70) return { name: 'Young Tree', progress: logs - 20, max: 50 };
    return { name: 'Adult Tree', progress: logs - 70, max: null };
  };

  const treeStage = getTreeStage(logCount);

  // Calculate stats
  const memoriesShared = useMemo(() => {
    const collections = appState.memoryCollections[appState.activeFamilyTreeId] || [];
    return collections.reduce((sum, c) => sum + c.photoCount, 0);
  }, [appState.memoryCollections, appState.activeFamilyTreeId]);

  const activitiesCompleted = activeTree?.activities.completed || 0;

  // Calculate check-ins this week
  const checkInsThisWeek = useMemo(() => {
    if (!mounted) return 0;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return (appState.checkIns || [])
      .filter((c) => {
        const timestamp = new Date(c.timestamp).getTime();
        return timestamp > oneWeekAgo && c.treeId === appState.activeFamilyTreeId;
      })
      .length;
  }, [appState.checkIns, appState.activeFamilyTreeId, mounted]);

  // Mock data for days active - in real app would be calculated from timestamps
  const daysActive = 14;

  // Get logs for current tree, sorted chronologically
  const treeLogs = useMemo(() => {
    return (appState.positiveMoments || [])
      .filter((log) => log.treeId === appState.activeFamilyTreeId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [appState.positiveMoments, appState.activeFamilyTreeId]);

  const selectedLog = selectedLogId ? treeLogs.find((log) => log.id === selectedLogId) || null : null;
  const selectedLogIndex = selectedLog ? treeLogs.findIndex((log) => log.id === selectedLogId) : -1;

  // Toggle star on a log
  const handleToggleStar = (logId: string) => {
    const updatedMoments = appState.positiveMoments.map((log) =>
      log.id === logId ? { ...log, starred: !log.starred } : log
    );
    setAppState({ ...appState, positiveMoments: updatedMoments });
  };

  // Navigate between logs chronologically
  const handleNavigateLog = (direction: 'prev' | 'next') => {
    if (selectedLogIndex === -1) return;
    const newIndex = direction === 'prev' ? selectedLogIndex - 1 : selectedLogIndex + 1;
    if (newIndex >= 0 && newIndex < treeLogs.length) {
      setSelectedLogId(treeLogs[newIndex].id);
    }
  };

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
      tree.id === appState.activeFamilyTreeId ? { ...tree, treeScore: 0, logCount: 0 } : tree
    );
    // Also clear all positive moments for this tree
    const updatedMoments = appState.positiveMoments.filter(
      (moment) => moment.treeId !== appState.activeFamilyTreeId
    );
    setAppState({ ...appState, trees: updatedTrees, positiveMoments: updatedMoments });
    setShowResetConfirm(false);
  };

  // Development helper: Jump to specific tree stage
  const jumpToStage = (targetLogCount: number) => {
    if (!activeTree) return;

    // Clear existing logs for this tree
    const updatedMoments = appState.positiveMoments.filter(
      (moment) => moment.treeId !== appState.activeFamilyTreeId
    );

    // Create dummy logs to reach target
    const dummyLogs: PositiveMoment[] = [];
    for (let i = 0; i < targetLogCount; i++) {
      dummyLogs.push({
        id: `dev-moment-${Date.now()}-${i}`,
        activityName: `Development Log ${i + 1}`,
        participantIds: [activeTree.members[0]?.id || ''],
        date: new Date().toISOString().split('T')[0],
        emotionRating: 4,
        notes: 'Development placeholder log',
        photos: [],
        pointsEarned: 3,
        timestamp: new Date(Date.now() - (targetLogCount - i) * 1000).toISOString(),
        treeId: appState.activeFamilyTreeId,
      });
    }

    // Update tree and logs
    const totalPoints = targetLogCount * 3;
    const updatedTrees = appState.trees.map((tree) =>
      tree.id === appState.activeFamilyTreeId
        ? { ...tree, treeScore: totalPoints, logCount: targetLogCount }
        : tree
    );

    setAppState({
      ...appState,
      trees: updatedTrees,
      positiveMoments: [...dummyLogs, ...updatedMoments],
    });
  };

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const photoPromise = new Promise<Photo>((resolve) => {
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          resolve({
            id: `photo-${Date.now()}-${i}`,
            url: base64,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            color: '#E8C4D4',
          });
        };
      });
      reader.readAsDataURL(file);
      const photo = await photoPromise;
      newPhotos.push(photo);
    }

    setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
    setUploading(false);
  };

  // Remove photo from upload list
  const removePhoto = (photoId: string) => {
    setUploadedPhotos(uploadedPhotos.filter((p) => p.id !== photoId));
  };

  // Calculate points based on what's filled in
  const calculatePoints = () => {
    let points = 1; // Base point for logging anything

    if (activityName.trim()) points += 1; // +1 for description
    if (notes.trim()) points += 2; // +2 for additional notes
    if (emotionRating !== undefined) points += 1;
    if (uploadedPhotos.length > 0) points += 1;

    return Math.min(6, points); // Cap at 6 points (1+1+2+1+1)
  };

  // Toggle participant selection
  const toggleParticipant = (personId: string) => {
    if (selectedParticipants.includes(personId)) {
      setSelectedParticipants(selectedParticipants.filter((id) => id !== personId));
    } else {
      setSelectedParticipants([...selectedParticipants, personId]);
    }
  };

  // Submit positive moment
  const handleSubmitMoment = () => {
    if (!activeTree) return;

    const points = calculatePoints();

    const newMoment: PositiveMoment = {
      id: `moment-${Date.now()}`,
      activityName: activityName.trim() || undefined,
      participantIds: selectedParticipants,
      additionalPeople: additionalPeople.trim() || undefined,
      date: momentDate,
      emotionRating,
      notes: notes.trim() || undefined,
      photos: uploadedPhotos,
      pointsEarned: points,
      timestamp: new Date().toISOString(),
      treeId: appState.activeFamilyTreeId,
    };

    // Update tree score and log count
    const newScore = treeScore + points;
    const newLogCount = (activeTree.logCount || 0) + 1;
    const updatedTrees = appState.trees.map((tree) =>
      tree.id === appState.activeFamilyTreeId ? { ...tree, treeScore: newScore, logCount: newLogCount } : tree
    );

    // Save moment and update score
    setAppState({
      ...appState,
      trees: updatedTrees,
      positiveMoments: [newMoment, ...(appState.positiveMoments || [])],
    });

    // Reset form and close modal
    setActivityName('');
    setSelectedParticipants([]);
    setAdditionalPeople('');
    setMomentDate(new Date().toISOString().split('T')[0]);
    setEmotionRating(undefined);
    setNotes('');
    setUploadedPhotos([]);
    setShowModal(false);
  };

  // Get stage description
  const getStageDescription = (stage: string) => {
    if (stage === 'Seed') return 'Your relationship is just beginning to take root. Every log creates a new root!';
    if (stage === 'Sprout') return 'Growth is happening! Your roots are spreading and a stem is forming.';
    if (stage === 'Young Tree') return 'Your relationship is branching out beautifully. New leaves grow with each log!';
    return 'Flourishing together! Your tree continues to grow with unlimited branches and leaves.';
  };

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main tree card */}
        <div className="bg-gradient-to-br from-white/70 to-sage/10 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200 mb-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-moss mb-2">Tree of Love</h1>
            <p className="text-gray-600 text-sm max-w-md mx-auto" suppressHydrationWarning>
              {mounted ? getStageDescription(treeStage.name) : 'Track your positive moments and watch your tree grow!'}
            </p>
          </div>

          {/* Tree visual */}
          <div className="mb-8">
            {mounted ? (
              <LoveTree
                score={logCount}
                logs={treeLogs}
                onElementClick={(logId) => setSelectedLogId(logId)}
              />
            ) : (
              <div className="h-[450px] flex items-center justify-center">
                <div className="text-gray-400">Loading tree...</div>
              </div>
            )}
          </div>

          {/* Stage and Log Count display */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-sage/30 to-moss/30 px-8 py-4 rounded-2xl shadow-md">
              <p className="text-sm text-gray-600 mb-1" suppressHydrationWarning>
                {mounted ? treeStage.name : 'Seed'}
              </p>
              <p className="text-3xl font-bold text-moss" suppressHydrationWarning>
                {mounted ? logCount : 0} {logCount === 1 ? 'Log' : 'Logs'}
              </p>
              <p className="text-xs text-gray-500 mt-1" suppressHydrationWarning>
                {mounted ? treeScore : 0} total points earned
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8 max-w-md mx-auto">
            {mounted && treeStage.max && (
              <>
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Next stage: {treeStage.progress}/{treeStage.max}</span>
                  <span>{treeStage.max - treeStage.progress} more logs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sage via-moss to-moss rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(treeStage.progress / treeStage.max) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </>
            )}
            {!treeStage.max && (
              <p className="text-center text-sm text-gray-600">
                🌳 Your tree is fully grown! Keep logging to add more branches and leaves.
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {/* Main action button */}
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-moss to-sage text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              Log a Positive Moment
            </button>

            {/* Reset button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:shadow-md transition-all hover:scale-105 active:scale-95"
            >
              Reset
            </button>
          </div>

          {/* Development Helper Buttons */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <p className="text-xs text-gray-500 text-center mb-3 font-semibold uppercase tracking-wide">
              Development Tools
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => jumpToStage(10)}
                className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-all hover:scale-105 active:scale-95"
              >
                Sprout (10)
              </button>
              <button
                onClick={() => jumpToStage(20)}
                className="px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-all hover:scale-105 active:scale-95"
              >
                Young Start (20)
              </button>
              <button
                onClick={() => jumpToStage(60)}
                className="px-3 py-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg text-xs font-medium hover:bg-teal-100 transition-all hover:scale-105 active:scale-95"
              >
                Young End (60)
              </button>
              <button
                onClick={() => jumpToStage(70)}
                className="px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition-all hover:scale-105 active:scale-95"
              >
                Adult Start (70)
              </button>
              <button
                onClick={() => jumpToStage(100)}
                className="px-3 py-2 bg-pink-50 border border-pink-200 text-pink-700 rounded-lg text-xs font-medium hover:bg-pink-100 transition-all hover:scale-105 active:scale-95"
              >
                Adult Mid (100)
              </button>
            </div>
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
              <p className="text-2xl font-bold text-gray-800 mb-1" suppressHydrationWarning>
                {mounted ? memberCount : 0}
              </p>
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
              <p className="text-2xl font-bold text-gray-800 mb-1" suppressHydrationWarning>
                {checkInsThisWeek}
              </p>
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
              <p className="text-2xl font-bold text-gray-800 mb-1" suppressHydrationWarning>
                {mounted ? memoriesShared : 0}
              </p>
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
                <span className="font-semibold text-moss" suppressHydrationWarning>
                  {mounted ? activitiesCompleted : 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-sage to-moss rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (mounted ? activitiesCompleted : 0) / 10 * 100)}%` }}
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

        {/* Positive Moment Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-moss to-sage text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Log a Positive Moment</h2>
                      <p className="text-sm text-white/90">
                        Add details to earn up to 6 points!
                      </p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                  {/* Points Preview */}
                  <div className="bg-gradient-to-r from-sage/20 to-moss/20 border-2 border-moss/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Points you&apos;ll earn</p>
                        <p className="text-3xl font-bold text-moss">{calculatePoints()}</p>
                      </div>
                      <div className="text-5xl">⭐</div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Fill in more details to earn more points!
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description <span className="text-gray-400 font-normal">(Optional +1pt)</span>
                    </label>
                    <input
                      type="text"
                      value={activityName}
                      onChange={(e) => setActivityName(e.target.value)}
                      placeholder="e.g., Family Game Night, Cooking Together..."
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Who Was Involved */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Who Was Involved? <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {activeTree?.members.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => toggleParticipant(member.id)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedParticipants.includes(member.id)
                              ? 'bg-moss text-white border-moss'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-moss'
                          }`}
                        >
                          {member.name}
                        </button>
                      ))}
                    </div>
                    {/* Additional People */}
                    <div className="mt-3">
                      <input
                        type="text"
                        value={additionalPeople}
                        onChange={(e) => setAdditionalPeople(e.target.value)}
                        placeholder="Add extended family or others (e.g., Grandma, Uncle Joe, Friends...)"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      When Did This Happen?
                    </label>
                    <input
                      type="date"
                      value={momentDate}
                      onChange={(e) => setMomentDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Emotion Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      How Did It Make You Feel? <span className="text-gray-400 font-normal">(Optional +1pt)</span>
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setEmotionRating(rating)}
                          className={`flex-1 py-3 rounded-lg border-2 transition-all text-2xl ${
                            emotionRating === rating
                              ? 'bg-moss text-white border-moss scale-110'
                              : 'bg-white border-gray-300 hover:border-moss hover:scale-105'
                          }`}
                        >
                          {['😢', '😕', '😐', '😊', '😄'][rating - 1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Add Photos <span className="text-gray-400 font-normal">(Optional +1pt)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-moss/10 file:text-moss hover:file:bg-moss/20 file:cursor-pointer"
                    />
                    {uploading && <p className="text-sm text-gray-600 mt-2">Uploading photos...</p>}

                    {/* Photo Preview Grid */}
                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {uploadedPhotos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Notes <span className="text-gray-400 font-normal">(Optional +2pt)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Share more about this special moment..."
                      rows={3}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitMoment}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-moss to-sage text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                      Save Moment (+{calculatePoints()} pts)
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowResetConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              >
                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Title and Message */}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Reset Tree?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  This will reset both your tree score and log count to 0. This action cannot be undone.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={resetTree}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Reset Tree
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Log Detail Modal */}
        {selectedLog && activeTree && (
          <LogDetailModal
            log={selectedLog}
            familyMembers={activeTree.members}
            onClose={() => setSelectedLogId(null)}
            onToggleStar={handleToggleStar}
            onNavigate={handleNavigateLog}
            hasPrev={selectedLogIndex > 0}
            hasNext={selectedLogIndex < treeLogs.length - 1}
          />
        )}
      </div>
    </AnimatedPage>
  );
}
