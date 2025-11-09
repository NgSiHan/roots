'use client';

import AnimatedPage from '@/components/AnimatedPage';
import { Accordion, AccordionItem } from '@/components/Accordion';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { motion } from 'framer-motion';

/**
 * Memories page - photo/memory hub with accordion UI
 */
export default function MemoriesPage() {
  const [appState, setAppState] = useLocalStorageState<AppState>('roots-app-state', {
    activeFamilyTreeId: initialTrees[0].id,
    trees: initialTrees,
    activitySuggestions,
    memoryCollections: memoryCollectionsData,
    lastExpandedMemory: {},
  });

  const activeTree = appState.trees.find((t) => t.id === appState.activeFamilyTreeId);
  const collections = appState.memoryCollections[appState.activeFamilyTreeId] || [];
  const lastExpanded = appState.lastExpandedMemory[appState.activeFamilyTreeId] || null;

  const handleExpandedChange = (id: string | null) => {
    setAppState({
      ...appState,
      lastExpandedMemory: {
        ...appState.lastExpandedMemory,
        [appState.activeFamilyTreeId]: id,
      },
    });
  };

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-moss mb-2">Memory Hub</h1>
          <p className="text-gray-600 text-sm">
            Curated collections of your family&apos;s favourite moments
          </p>
        </div>

        {/* Collections accordion */}
        <Accordion defaultExpanded={lastExpanded} onExpandedChange={handleExpandedChange}>
          {collections.map((collection, index) => (
            <AccordionItem
              key={collection.id}
              id={collection.id}
              title={collection.title}
              subtitle={`${collection.photoCount} photos • Last updated ${collection.lastUpdated}`}
              isExpanded={false}
              onToggle={() => {}}
            >
              {/* Photo grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {collection.photos.map((photo, photoIndex) => (
                  <motion.div
                    key={photo.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: photoIndex * 0.05, duration: 0.3 }}
                    className="group cursor-pointer"
                  >
                    <div
                      className="aspect-square rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center p-4 text-center"
                      style={{ backgroundColor: photo.color }}
                    >
                      {/* Placeholder icon */}
                      <div className="text-white">
                        <div className="text-4xl mb-2">📷</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">{photo.caption}</p>
                  </motion.div>
                ))}
              </div>

              {/* Add more button */}
              <div className="mt-6 text-center">
                <button className="px-4 py-2 bg-sage/20 text-moss rounded-lg text-sm font-medium hover:bg-sage/30 transition-colors">
                  + Add More Photos
                </button>
              </div>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Empty state */}
        {collections.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No memories yet</h3>
            <p className="text-gray-600 mb-6">
              Start creating collections for your family photos and memories
            </p>
            <button className="px-6 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95">
              Create First Collection
            </button>
          </div>
        )}

        {/* Stats card */}
        {collections.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Memory Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-sage/10 rounded-lg">
                <div className="text-2xl font-bold text-moss">{collections.length}</div>
                <div className="text-xs text-gray-600 mt-1">Collections</div>
              </div>
              <div className="p-4 bg-sand/30 rounded-lg">
                <div className="text-2xl font-bold text-terracotta">
                  {collections.reduce((sum, c) => sum + c.photoCount, 0)}
                </div>
                <div className="text-xs text-gray-600 mt-1">Total Photos</div>
              </div>
            </div>
          </div>
        )}

        {/* Helper text */}
        <div className="mt-8 p-4 bg-sand/30 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            <strong>💡 Tip:</strong> Click on any collection to expand and view photos. Use the
            family tree selector above to switch between different families.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
