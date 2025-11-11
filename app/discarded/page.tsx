'use client';

import AnimatedPage from '@/components/AnimatedPage';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState, DiscardedPhoto } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';

/**
 * Discarded Photos page - 30-day recovery bin
 */
export default function DiscardedPage() {
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
    discardedPhotos: [],
  });

  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [lightboxPhoto, setLightboxPhoto] = useState<DiscardedPhoto | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Clean up expired photos on mount
    cleanupExpiredPhotos();
  }, []);

  // Clean up photos that have expired (>30 days)
  const cleanupExpiredPhotos = () => {
    const now = Date.now();
    const validPhotos = (appState.discardedPhotos || []).filter(dp => {
      const expiresAt = new Date(dp.expiresAt).getTime();
      return expiresAt > now;
    });

    if (validPhotos.length !== (appState.discardedPhotos || []).length) {
      setAppState({
        ...appState,
        discardedPhotos: validPhotos,
      });
    }
  };

  // Group photos by days remaining
  const groupedPhotos = useMemo(() => {
    const now = Date.now();
    const groups: Record<string, DiscardedPhoto[]> = {
      'Expiring Soon (< 7 days)': [],
      'Recently Discarded (7-14 days left)': [],
      'Safe (> 14 days left)': [],
    };

    (appState.discardedPhotos || []).forEach(dp => {
      const expiresAt = new Date(dp.expiresAt).getTime();
      const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

      if (daysLeft < 7) {
        groups['Expiring Soon (< 7 days)'].push(dp);
      } else if (daysLeft < 14) {
        groups['Recently Discarded (7-14 days left)'].push(dp);
      } else {
        groups['Safe (> 14 days left)'].push(dp);
      }
    });

    return groups;
  }, [appState.discardedPhotos]);

  const handleRecover = (photoIds: string[]) => {
    const toRecover = (appState.discardedPhotos || []).filter(dp =>
      photoIds.includes(dp.photo.id)
    );

    // Restore photos to their original albums/memories
    const updatedAlbums = { ...appState.albums };
    const activeTreeId = appState.activeFamilyTreeId;

    toRecover.forEach(dp => {
      const albums = updatedAlbums[activeTreeId] || [];
      const albumIndex = albums.findIndex(a => a.id === dp.sourceAlbumId);

      if (albumIndex !== -1) {
        const album = albums[albumIndex];
        const memoryIndex = album.memories.findIndex(m => m.id === dp.sourceMemoryId);

        if (memoryIndex !== -1) {
          // Add photo back to memory
          const memory = album.memories[memoryIndex];
          album.memories[memoryIndex] = {
            ...memory,
            photos: [...memory.photos, dp.photo],
          };
          albums[albumIndex] = album;
        }
      }
    });

    // Remove from discarded
    const remainingDiscarded = (appState.discardedPhotos || []).filter(
      dp => !photoIds.includes(dp.photo.id)
    );

    setAppState({
      ...appState,
      albums: updatedAlbums,
      discardedPhotos: remainingDiscarded,
    });

    setSelectedPhotos(new Set());
  };

  const handlePermanentDelete = (photoIds: string[]) => {
    if (!confirm(`Permanently delete ${photoIds.length} photo(s)? This cannot be undone.`)) {
      return;
    }

    const remainingDiscarded = (appState.discardedPhotos || []).filter(
      dp => !photoIds.includes(dp.photo.id)
    );

    setAppState({
      ...appState,
      discardedPhotos: remainingDiscarded,
    });

    setSelectedPhotos(new Set());
  };

  const toggleSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = Date.now();
    const expires = new Date(expiresAt).getTime();
    return Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
  };

  const selectAllPhotos = () => {
    const allPhotoIds = new Set<string>();
    (appState.discardedPhotos || []).forEach(dp => {
      allPhotoIds.add(dp.photo.id);
    });
    setSelectedPhotos(allPhotoIds);
  };

  const deselectAll = () => {
    setSelectedPhotos(new Set());
  };

  if (!mounted) {
    return (
      <AnimatedPage>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-moss mb-2">Discarded Photos</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </AnimatedPage>
    );
  }

  const totalDiscarded = appState.discardedPhotos?.length || 0;

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-moss mb-2">Discarded Photos</h1>
          <p className="text-gray-600 text-sm">
            Photos are kept for 30 days before permanent deletion
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-orange-700">{totalDiscarded}</div>
            <div className="text-sm text-gray-600">Total Discarded</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-700">
              {groupedPhotos['Expiring Soon (< 7 days)'].length}
            </div>
            <div className="text-sm text-gray-600">Expiring Soon</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-700">{selectedPhotos.size}</div>
            <div className="text-sm text-gray-600">Selected</div>
          </div>
        </div>

        {/* Selection Actions */}
        {totalDiscarded > 0 && (
          <div className="mb-6 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={selectAllPhotos}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                Select All ({totalDiscarded})
              </button>
              {selectedPhotos.size > 0 && (
                <button
                  onClick={deselectAll}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Deselect All
                </button>
              )}
            </div>
            {selectedPhotos.size > 0 && (
              <div className="text-sm text-gray-600 font-medium">
                {selectedPhotos.size} of {totalDiscarded} selected
              </div>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedPhotos.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-moss/10 border-2 border-moss rounded-xl flex gap-3"
          >
            <button
              onClick={() => handleRecover(Array.from(selectedPhotos))}
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              Recover {selectedPhotos.size} Photo(s)
            </button>
            <button
              onClick={() => handlePermanentDelete(Array.from(selectedPhotos))}
              className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              Delete Permanently
            </button>
            <button
              onClick={() => setSelectedPhotos(new Set())}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Clear Selection
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {totalDiscarded === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🗑️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Discarded Photos
            </h3>
            <p className="text-gray-600">
              Duplicate or manually discarded photos will appear here
            </p>
          </div>
        ) : (
          <>
            {/* Grouped Photos */}
            {Object.entries(groupedPhotos).map(([groupName, photos]) => {
              if (photos.length === 0) return null;

              return (
                <div key={groupName} className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">{groupName}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {photos.map((dp) => {
                      const daysLeft = getDaysRemaining(dp.expiresAt);
                      const isSelected = selectedPhotos.has(dp.photo.id);

                      return (
                        <motion.div
                          key={dp.photo.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          {/* Selection Checkbox */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelection(dp.photo.id);
                            }}
                            className="absolute top-2 left-2 z-10 w-6 h-6 rounded-md border-2 border-white bg-black/50 cursor-pointer flex items-center justify-center hover:bg-black/70 transition-colors"
                          >
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>

                          {/* Photo */}
                          <div
                            onClick={() => setLightboxPhoto(dp)}
                            className={`
                              aspect-square rounded-lg overflow-hidden cursor-pointer
                              transition-all hover:scale-105 hover:shadow-xl
                              ${isSelected ? 'ring-4 ring-moss' : ''}
                            `}
                            style={{ backgroundColor: dp.photo.color }}
                          >
                            <img
                              src={dp.photo.url}
                              alt={dp.photo.caption}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <div className="text-white text-xs font-semibold">
                              {daysLeft} days left
                            </div>
                            {dp.similarityScore && (
                              <div className="text-white/80 text-xs">
                                {dp.similarityScore}% similar
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxPhoto(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {lightboxPhoto.photo.caption}
                      </h3>
                      <p className="text-sm text-gray-600">
                        From: {lightboxPhoto.sourceMemoryTitle}
                      </p>
                      <p className="text-sm text-orange-600 font-semibold mt-2">
                        {getDaysRemaining(lightboxPhoto.expiresAt)} days until permanent deletion
                      </p>
                    </div>
                    <button
                      onClick={() => setLightboxPhoto(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className="p-6">
                  <img
                    src={lightboxPhoto.photo.url}
                    alt={lightboxPhoto.photo.caption}
                    className="w-full rounded-lg"
                  />

                  {/* Details */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold">Reason:</span>
                      <span>{lightboxPhoto.reason === 'duplicate' ? 'Duplicate Photo' : 'Manually Discarded'}</span>
                    </div>
                    {lightboxPhoto.similarityScore && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold">Similarity:</span>
                        <span>{lightboxPhoto.similarityScore}%</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold">Discarded:</span>
                      <span>{new Date(lightboxPhoto.discardedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        handleRecover([lightboxPhoto.photo.id]);
                        setLightboxPhoto(null);
                      }}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md"
                    >
                      Recover Photo
                    </button>
                    <button
                      onClick={() => {
                        handlePermanentDelete([lightboxPhoto.photo.id]);
                        setLightboxPhoto(null);
                      }}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-md"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
