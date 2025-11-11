'use client';

import AnimatedPage from '@/components/AnimatedPage';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState, Album, Memory, Photo, DiscardedPhoto } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData, albumsData } from '@/lib/seedData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Memories page - photo/memory hub with albums and lightbox
 */
export default function MemoriesPage() {
  const [appState, setAppState] = useLocalStorageState<AppState>('roots-app-state', {
    activeFamilyTreeId: initialTrees[0].id,
    trees: initialTrees,
    activitySuggestions,
    memoryCollections: memoryCollectionsData,
    albums: albumsData,
    lastExpandedMemory: {},
    lastExpandedAlbum: {},
    checkIns: [],
    notifications: [],
    positiveMoments: [],
    discardedPhotos: [],
  });

  // Safely access albums, initializing from albumsData if undefined
  const albums = appState.albums?.[appState.activeFamilyTreeId] || albumsData[appState.activeFamilyTreeId] || [];
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(
    appState.lastExpandedAlbum?.[appState.activeFamilyTreeId] || null
  );
  const [lightboxMemory, setLightboxMemory] = useState<Memory | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0);
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [selectedAlbumForMemory, setSelectedAlbumForMemory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [duplicateResults, setDuplicateResults] = useState<any>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [deleteConfirmAlbum, setDeleteConfirmAlbum] = useState<string | null>(null);
  const [deleteConfirmMemory, setDeleteConfirmMemory] = useState<{ albumId: string; memoryId: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    // Initialize discardedPhotos if it doesn't exist
    if (!appState.discardedPhotos) {
      setAppState({
        ...appState,
        discardedPhotos: [],
      });
    }
  }, []);

  const handleAlbumToggle = (albumId: string) => {
    const newExpanded = expandedAlbum === albumId ? null : albumId;
    setExpandedAlbum(newExpanded);
    setAppState({
      ...appState,
      albums: appState.albums || {},
      lastExpandedAlbum: {
        ...(appState.lastExpandedAlbum || {}),
        [appState.activeFamilyTreeId]: newExpanded,
      },
    });
  };

  const openLightbox = (memory: Memory, photoIndex: number = 0) => {
    setLightboxMemory(memory);
    setLightboxPhotoIndex(photoIndex);
  };

  // Scan for duplicate photos
  const handleScanDuplicates = async () => {
    setIsScanning(true);
    setScanError(null);

    try {
      // Collect all photos from all albums
      const allPhotos: Photo[] = [];
      albums.forEach(album => {
        album.memories.forEach(memory => {
          allPhotos.push(...memory.photos);
        });
      });

      if (allPhotos.length < 2) {
        setScanError('Need at least 2 photos to scan for duplicates');
        setIsScanning(false);
        return;
      }

      const response = await fetch('/api/memories/scan-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photos: allPhotos }),
      });

      const data = await response.json();

      if (data.success && data.duplicateGroups) {
        setDuplicateResults(data);
        setShowDuplicateModal(true);
      } else {
        setScanError(data.error || 'Failed to scan for duplicates');
      }
    } catch (error) {
      console.error('Error scanning for duplicates:', error);
      setScanError('Network error - please check your connection');
    } finally {
      setIsScanning(false);
    }
  };

  // Delete album with confirmation
  const handleDeleteAlbum = (albumId: string) => {
    if (deleteConfirmAlbum === albumId) {
      // Second click - actually delete
      const updatedAlbums = albums.filter(a => a.id !== albumId);
      setAppState({
        ...appState,
        albums: {
          ...appState.albums,
          [appState.activeFamilyTreeId]: updatedAlbums,
        },
      });
      setDeleteConfirmAlbum(null);
    } else {
      // First click - show confirmation
      setDeleteConfirmAlbum(albumId);
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirmAlbum(null), 3000);
    }
  };

  // Delete memory with confirmation
  const handleDeleteMemory = (albumId: string, memoryId: string) => {
    const confirmKey = `${albumId}-${memoryId}`;
    const currentConfirm = deleteConfirmMemory ? `${deleteConfirmMemory.albumId}-${deleteConfirmMemory.memoryId}` : null;

    if (currentConfirm === confirmKey) {
      // Second click - actually delete
      const updatedAlbums = albums.map(album => {
        if (album.id === albumId) {
          return {
            ...album,
            memories: album.memories.filter(m => m.id !== memoryId),
            lastUpdated: 'Just now',
          };
        }
        return album;
      });

      setAppState({
        ...appState,
        albums: {
          ...appState.albums,
          [appState.activeFamilyTreeId]: updatedAlbums,
        },
      });
      setDeleteConfirmMemory(null);
    } else {
      // First click - show confirmation
      setDeleteConfirmMemory({ albumId, memoryId });
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirmMemory(null), 3000);
    }
  };

  // Discard selected duplicates
  const handleDiscardDuplicates = (photosToDiscard: Array<{ photo: Photo; duplicateOf: string; similarityScore: number; reason: string }>) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const newDiscarded: DiscardedPhoto[] = photosToDiscard.map(item => {
      // Find source album and memory
      let sourceAlbumId = '';
      let sourceMemoryId = '';
      let sourceMemoryTitle = '';

      albums.forEach(album => {
        album.memories.forEach(memory => {
          if (memory.photos.some(p => p.id === item.photo.id)) {
            sourceAlbumId = album.id;
            sourceMemoryId = memory.id;
            sourceMemoryTitle = memory.title;
          }
        });
      });

      return {
        photo: item.photo,
        discardedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        reason: 'duplicate' as const,
        duplicateOf: item.duplicateOf,
        similarityScore: item.similarityScore,
        sourceAlbumId,
        sourceMemoryId,
        sourceMemoryTitle,
      };
    });

    // Remove from albums
    const photoIdsToRemove = new Set(photosToDiscard.map(item => item.photo.id));
    const updatedAlbums = albums.map(album => ({
      ...album,
      memories: album.memories.map(memory => ({
        ...memory,
        photos: memory.photos.filter(p => !photoIdsToRemove.has(p.id)),
      })),
    }));

    setAppState({
      ...appState,
      albums: {
        ...appState.albums,
        [appState.activeFamilyTreeId]: updatedAlbums,
      },
      discardedPhotos: [...(appState.discardedPhotos || []), ...newDiscarded],
    });

    setShowDuplicateModal(false);
    setDuplicateResults(null);
  };

  const closeLightbox = () => {
    setLightboxMemory(null);
    setLightboxPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (lightboxMemory) {
      setLightboxPhotoIndex((prev) => (prev + 1) % lightboxMemory.photos.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxMemory) {
      setLightboxPhotoIndex((prev) =>
        prev === 0 ? lightboxMemory.photos.length - 1 : prev - 1
      );
    }
  };

  // Calculate stats
  const totalAlbums = albums.length;
  const totalMemories = albums.reduce((sum, album) => sum + album.memories.length, 0);
  const totalPhotos = albums.reduce(
    (sum, album) => sum + album.memories.reduce((mSum, memory) => mSum + memory.photos.length, 0),
    0
  );

  if (!mounted) {
    return (
      <AnimatedPage>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-moss mb-2">Memory Albums</h1>
            <p className="text-gray-600 text-sm">Your family&apos;s precious moments organized</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-moss mb-2">Memory Albums</h1>
          <p className="text-gray-600 text-sm">Your family&apos;s precious moments organized</p>
        </div>

        {/* Stats Cards */}
        {albums.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md border-l-4 border-purple-300"
            >
              <div className="text-3xl font-bold text-purple-700">{totalAlbums}</div>
              <div className="text-sm text-gray-600 mt-1">Albums</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-md border-l-4 border-blue-300"
            >
              <div className="text-3xl font-bold text-blue-700">{totalMemories}</div>
              <div className="text-sm text-gray-600 mt-1">Memories</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-md border-l-4 border-amber-300"
            >
              <div className="text-3xl font-bold text-amber-700">{totalPhotos}</div>
              <div className="text-sm text-gray-600 mt-1">Photos</div>
            </motion.div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <Link href="/discarded">
            <button className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2">
              🗑️ Discarded Photos
              {(appState.discardedPhotos?.length || 0) > 0 && (
                <span className="px-2 py-0.5 bg-white text-orange-600 rounded-full text-xs font-bold">
                  {appState.discardedPhotos?.length}
                </span>
              )}
            </button>
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handleScanDuplicates}
              disabled={isScanning || albums.length === 0}
              className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isScanning ? '🔍 Scanning...' : '🔍 Scan for Duplicates'}
            </button>
            <button
              onClick={() => setShowAddAlbumModal(true)}
              className="px-5 py-2.5 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              + Create Album
            </button>
          </div>
        </div>

        {/* Scan Error */}
        <AnimatePresence>
          {scanError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-800">{scanError}</p>
                <button
                  onClick={() => setScanError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning Progress */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl animate-spin">🔍</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    Scanning for duplicates...
                  </h3>
                  <p className="text-sm text-gray-600">
                    Using AI to detect similar and duplicate photos
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Albums */}
        {albums.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No albums yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first album to start organizing family memories
            </p>
            <button
              onClick={() => setShowAddAlbumModal(true)}
              className="px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95"
            >
              Create First Album
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {albums.map((album, index) => (
              <AlbumAccordion
                key={album.id}
                album={album}
                index={index}
                isExpanded={expandedAlbum === album.id}
                onToggle={() => handleAlbumToggle(album.id)}
                onOpenLightbox={openLightbox}
                onAddMemory={() => {
                  setSelectedAlbumForMemory(album.id);
                  setShowAddMemoryModal(true);
                }}
                onDeleteAlbum={() => handleDeleteAlbum(album.id)}
                isDeleteConfirmAlbum={deleteConfirmAlbum === album.id}
                onDeleteMemory={(memoryId) => handleDeleteMemory(album.id, memoryId)}
                deleteConfirmMemory={deleteConfirmMemory}
              />
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxMemory && (
          <PhotoLightbox
            memory={lightboxMemory}
            currentPhotoIndex={lightboxPhotoIndex}
            onClose={closeLightbox}
            onNext={nextPhoto}
            onPrev={prevPhoto}
          />
        )}

        {/* Add Album Modal */}
        <AddAlbumModal
          isOpen={showAddAlbumModal}
          onClose={() => setShowAddAlbumModal(false)}
          onAdd={(newAlbum) => {
            const updatedAlbums = {
              ...(appState.albums || {}),
              [appState.activeFamilyTreeId]: [...albums, newAlbum],
            };
            setAppState({ ...appState, albums: updatedAlbums });
            setShowAddAlbumModal(false);
          }}
        />

        {/* Add Memory Modal */}
        <AddMemoryModal
          isOpen={showAddMemoryModal}
          onClose={() => {
            setShowAddMemoryModal(false);
            setSelectedAlbumForMemory(null);
          }}
          onAdd={(newMemory) => {
            if (selectedAlbumForMemory) {
              const updatedAlbums = albums.map((album) => {
                if (album.id === selectedAlbumForMemory) {
                  return {
                    ...album,
                    memories: [...album.memories, newMemory],
                    lastUpdated: 'Just now',
                  };
                }
                return album;
              });
              setAppState({
                ...appState,
                albums: {
                  ...(appState.albums || {}),
                  [appState.activeFamilyTreeId]: updatedAlbums,
                },
              });
            }
            setShowAddMemoryModal(false);
            setSelectedAlbumForMemory(null);
          }}
        />

        {/* Duplicate Results Modal */}
        <DuplicateReviewModal
          isOpen={showDuplicateModal}
          duplicateResults={duplicateResults}
          onClose={() => {
            setShowDuplicateModal(false);
            setDuplicateResults(null);
          }}
          onDiscard={handleDiscardDuplicates}
        />
      </div>
    </AnimatedPage>
  );
}

// Duplicate Review Modal Component
function DuplicateReviewModal({
  isOpen,
  duplicateResults,
  onClose,
  onDiscard,
}: {
  isOpen: boolean;
  duplicateResults: any;
  onClose: () => void;
  onDiscard: (photos: Array<{ photo: Photo; duplicateOf: string; similarityScore: number; reason: string }>) => void;
}) {
  const [selectedDuplicates, setSelectedDuplicates] = useState<Set<string>>(new Set());

  if (!isOpen || !duplicateResults) return null;

  const { duplicateGroups, totalDuplicates } = duplicateResults;

  if (duplicateGroups.length === 0) {
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
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Duplicates Found!</h3>
            <p className="text-gray-600 mb-6">
              All your photos appear to be unique.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const toggleDuplicate = (photoId: string) => {
    const newSelected = new Set(selectedDuplicates);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedDuplicates(newSelected);
  };

  const selectAll = () => {
    const allDuplicateIds = new Set<string>();
    duplicateGroups.forEach((group: any) => {
      group.duplicates.forEach((dup: any) => {
        allDuplicateIds.add(dup.photo.id);
      });
    });
    setSelectedDuplicates(allDuplicateIds);
  };

  const handleDiscard = () => {
    const photosToDiscard: Array<{ photo: Photo; duplicateOf: string; similarityScore: number; reason: string }> = [];

    duplicateGroups.forEach((group: any) => {
      group.duplicates.forEach((dup: any) => {
        if (selectedDuplicates.has(dup.photo.id)) {
          photosToDiscard.push({
            photo: dup.photo,
            duplicateOf: group.original.id,
            similarityScore: dup.similarityScore,
            reason: dup.reason,
          });
        }
      });
    });

    onDiscard(photosToDiscard);
    setSelectedDuplicates(new Set());
  };

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
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white p-6 border-b z-10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Found {totalDuplicates} Potential Duplicate{totalDuplicates !== 1 ? 's' : ''}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Review and select duplicates to discard (30-day recovery available)
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm"
              >
                Select All Duplicates
              </button>
              <button
                onClick={() => setSelectedDuplicates(new Set())}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm"
                disabled={selectedDuplicates.size === 0}
              >
                Clear Selection
              </button>
              <div className="flex-1" />
              <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm">
                {selectedDuplicates.size} selected
              </div>
            </div>
          </div>

          {/* Duplicate Groups */}
          <div className="p-6 space-y-8">
            {duplicateGroups.map((group: any, groupIndex: number) => (
              <div key={groupIndex} className="border-2 border-gray-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Group {groupIndex + 1}: {group.duplicates.length} duplicate{group.duplicates.length !== 1 ? 's' : ''} found
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Original Photo */}
                  <div className="border-4 border-green-300 rounded-lg p-3 bg-green-50">
                    <div className="text-xs font-bold text-green-700 mb-2 uppercase">✓ Original (Keep)</div>
                    <img
                      src={group.original.url}
                      alt={group.original.caption}
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm font-semibold text-gray-800 truncate">{group.original.caption}</p>
                  </div>

                  {/* Duplicates */}
                  {group.duplicates.map((dup: any) => {
                    const isSelected = selectedDuplicates.has(dup.photo.id);
                    return (
                      <div
                        key={dup.photo.id}
                        onClick={() => toggleDuplicate(dup.photo.id)}
                        className={`
                          border-2 rounded-lg p-3 cursor-pointer transition-all hover:scale-105
                          ${isSelected ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-bold text-gray-600 uppercase">
                            Duplicate ({dup.similarityScore}% similar)
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleDuplicate(dup.photo.id)}
                            className="w-5 h-5"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <img
                          src={dup.photo.url}
                          alt={dup.photo.caption}
                          className="w-full aspect-square object-cover rounded-lg mb-2"
                        />
                        <p className="text-sm font-semibold text-gray-800 truncate">{dup.photo.caption}</p>
                        <p className="text-xs text-gray-600 mt-1">{dup.reason}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white p-6 border-t flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDiscard}
              disabled={selectedDuplicates.size === 0}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Discard {selectedDuplicates.size} Photo{selectedDuplicates.size !== 1 ? 's' : ''} (30-day recovery)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Album Accordion Component
function AlbumAccordion({
  album,
  index,
  isExpanded,
  onToggle,
  onOpenLightbox,
  onAddMemory,
  onDeleteAlbum,
  isDeleteConfirmAlbum,
  onDeleteMemory,
  deleteConfirmMemory,
}: {
  album: Album;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenLightbox: (memory: Memory, photoIndex: number) => void;
  onAddMemory: () => void;
  onDeleteAlbum: () => void;
  isDeleteConfirmAlbum: boolean;
  onDeleteMemory: (memoryId: string) => void;
  deleteConfirmMemory: { albumId: string; memoryId: string } | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden"
    >
      {/* Album Header */}
      <div className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <button
          onClick={onToggle}
          className="flex items-center gap-4 flex-1"
        >
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: album.coverColor }}
          >
            📷
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-800">{album.title}</h3>
            <p className="text-sm text-gray-600">{album.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {album.memories.length} memories • Updated {album.lastUpdated}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteAlbum();
            }}
            className={`text-sm px-3 py-2 rounded-lg transition-all ${
              isDeleteConfirmAlbum
                ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
            title={isDeleteConfirmAlbum ? 'Click again to confirm deletion' : 'Delete album'}
          >
            {isDeleteConfirmAlbum ? '⚠️ Confirm?' : '🗑️ Delete'}
          </button>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Album Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200"
          >
            <div className="p-6">
              {/* Memories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                {album.memories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onOpenLightbox={onOpenLightbox}
                    onDelete={() => onDeleteMemory(memory.id)}
                    isDeleteConfirm={
                      deleteConfirmMemory?.albumId === album.id &&
                      deleteConfirmMemory?.memoryId === memory.id
                    }
                  />
                ))}
              </div>

              {/* Add Memory Button */}
              <button
                onClick={onAddMemory}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-moss hover:text-moss transition-all font-medium"
              >
                + Add Memory
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Memory Card with Photo Stack
function MemoryCard({
  memory,
  onOpenLightbox,
  onDelete,
  isDeleteConfirm,
}: {
  memory: Memory;
  onOpenLightbox: (memory: Memory, photoIndex: number) => void;
  onDelete: () => void;
  isDeleteConfirm: boolean;
}) {
  const stackPhotos = memory.photos.slice(0, 3);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-4 cursor-pointer"
      onClick={() => onOpenLightbox(memory, 0)}
    >
      {/* Photo Stack */}
      <div className="relative h-40 mb-3">
        {stackPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="absolute rounded-lg shadow-lg overflow-hidden"
            style={{
              backgroundColor: photo.url ? 'transparent' : photo.color,
              left: `${index * 12}px`,
              top: `${index * 8}px`,
              width: `calc(100% - ${index * 24}px)`,
              height: `calc(100% - ${index * 16}px)`,
              zIndex: stackPhotos.length - index,
              rotate: `${index % 2 === 0 ? -2 : 2}deg`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {photo.url ? (
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl">
                📷
              </div>
            )}
          </motion.div>
        ))}
        {memory.photos.length > 3 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-50">
            +{memory.photos.length - 3}
          </div>
        )}
      </div>

      {/* Memory Info */}
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-gray-800">{memory.title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`text-xs px-2 py-1 rounded transition-all ${
            isDeleteConfirm
              ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
          title={isDeleteConfirm ? 'Click again to confirm deletion' : 'Delete memory'}
        >
          {isDeleteConfirm ? '⚠️ Confirm?' : '🗑️'}
        </button>
      </div>
      <p className="text-xs text-gray-600 mb-2">{memory.date}</p>
      <p className="text-xs text-gray-500">{memory.photos.length} photos</p>
    </motion.div>
  );
}

// Photo Lightbox with Sliding Stack Animation
function PhotoLightbox({
  memory,
  currentPhotoIndex,
  onClose,
  onNext,
  onPrev,
}: {
  memory: Memory;
  currentPhotoIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const currentPhoto = memory.photos[currentPhotoIndex];
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    onNext();
  };

  const handlePrev = () => {
    setDirection(-1);
    onPrev();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Memory Title & Photo Counter */}
        <div className="absolute -top-12 left-0 text-white">
          <h3 className="text-xl font-bold">{memory.title}</h3>
          <p className="text-sm text-gray-300">
            Photo {currentPhotoIndex + 1} of {memory.photos.length}
          </p>
        </div>

        {/* Photo Display with Stack Animation */}
        <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPhotoIndex}
              custom={direction}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0, rotate: direction > 0 ? 10 : -10 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0, rotate: direction > 0 ? -10 : 10 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: currentPhoto.url ? 'transparent' : currentPhoto.color }}
            >
              {currentPhoto.url ? (
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.caption}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-white text-center">
                  <div className="text-8xl mb-4">📷</div>
                  <p className="text-lg font-medium">{currentPhoto.caption}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          {/* Caption overlay for real photos */}
          {currentPhoto.url && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
              <p className="text-lg font-medium">{currentPhoto.caption}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Photo Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {memory.photos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentPhotoIndex ? 1 : -1);
                // We need to call a handler that sets the index
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentPhotoIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Add Album Modal
function AddAlbumModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (album: Album) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverColor, setCoverColor] = useState('#87CEEB');

  const colors = ['#87CEEB', '#FFB6C1', '#DDA0DD', '#98FB98', '#FFD700', '#FFA07A', '#E6E6FA'];

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      coverColor,
      lastUpdated: 'Just now',
      memories: [],
    };

    onAdd(newAlbum);
    setTitle('');
    setDescription('');
    setCoverColor('#87CEEB');
  };

  if (!isOpen) return null;

  return (
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
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="p-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Create New Album</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Album Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Vacation 2024"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this album..."
              rows={3}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Color</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCoverColor(color)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    coverColor === color ? 'ring-4 ring-moss scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Buttons - Sticky at Bottom */}
        <div className="p-6 pt-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex-1 px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Create Album
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Add Memory Modal
function AddMemoryModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memory: Memory) => void;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Convert to base64
      const reader = new FileReader();
      const photoPromise = new Promise<Photo>((resolve) => {
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          resolve({
            id: `photo-${Date.now()}-${i}`,
            url: base64,
            caption: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            color: '#E8C4D4', // Not used when we have real images
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

  const removePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || uploadedPhotos.length === 0) return;

    const newMemory: Memory = {
      id: `memory-${Date.now()}`,
      title: title.trim(),
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      photos: uploadedPhotos,
    };

    onAdd(newMemory);
    setTitle('');
    setDate('');
    setUploadedPhotos([]);
  };

  const handleClose = () => {
    setTitle('');
    setDate('');
    setUploadedPhotos([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
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
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="p-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Memory</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Memory Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Beach Day"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date (Optional)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g., July 15, 2024"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-moss focus:outline-none transition-colors"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-moss hover:bg-gray-50 transition-colors"
            >
              <div className="text-gray-600">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">
                  {uploading ? 'Uploading...' : 'Click to upload photos'}
                </span>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
              </div>
            </label>

            {/* Photo Previews */}
            {uploadedPhotos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {uploadedPhotos.map((photo, index) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <p className="text-xs text-gray-600 mt-1 truncate">{photo.caption}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {uploadedPhotos.length} photo{uploadedPhotos.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
        </div>

        {/* Buttons - Sticky at Bottom */}
        <div className="p-6 pt-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || uploadedPhotos.length === 0 || uploading}
            className="flex-1 px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Add Memory
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
