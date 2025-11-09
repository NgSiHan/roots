'use client';

import AnimatedPage from '@/components/AnimatedPage';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState, Person } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

// Generation colors for visual distinction
const GENERATION_COLORS = [
  { bg: '#FEF3E2', border: '#F4D9A6', label: 'rgb(212, 165, 116)' }, // Warm beige
  { bg: '#E8F5E9', border: '#A8C69F', label: 'rgb(122, 155, 118)' }, // Soft green
  { bg: '#E3F2FD', border: '#90C4E8', label: 'rgb(66, 165, 245)' },  // Light blue
  { bg: '#FCE4EC', border: '#F8BBD0', label: 'rgb(236, 64, 122)' },  // Soft pink
];

/**
 * Person Details Modal
 */
function PersonModal({
  person,
  onClose,
  onSave,
  onDelete,
}: {
  person: Person;
  onClose: () => void;
  onSave: (updated: Person) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPerson, setEditedPerson] = useState(person);

  const handleSave = () => {
    onSave(editedPerson);
    setIsEditing(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ backgroundColor: person.avatarColor }}
            >
              {person.initials}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPerson.name}
                  onChange={(e) => setEditedPerson({ ...editedPerson, name: e.target.value })}
                  className="text-2xl font-bold text-gray-800 border-b-2 border-moss focus:outline-none"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{person.name}</h2>
              )}
              <p className="text-sm text-gray-500 mt-1">{person.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Birth Year</span>
            {isEditing ? (
              <input
                type="number"
                value={editedPerson.birthYear || ''}
                onChange={(e) =>
                  setEditedPerson({ ...editedPerson, birthYear: parseInt(e.target.value) })
                }
                className="text-gray-800 font-semibold border-b border-moss focus:outline-none w-24 text-right"
              />
            ) : (
              <span className="text-gray-800 font-semibold">{person.birthYear || 'N/A'}</span>
            )}
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Relationship</span>
            {isEditing ? (
              <input
                type="text"
                value={editedPerson.role}
                onChange={(e) => setEditedPerson({ ...editedPerson, role: e.target.value })}
                className="text-gray-800 font-semibold border-b border-moss focus:outline-none"
              />
            ) : (
              <span className="text-gray-800 font-semibold">{person.role}</span>
            )}
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Generation</span>
            <span className="text-gray-800 font-semibold">Generation {person.generation + 1}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete ${person.name}?`)) {
                    onDelete();
                    onClose();
                  }
                }}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all hover:scale-105 active:scale-95"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditedPerson(person);
                  setIsEditing(false);
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Interactive Person Card with Add Buttons
 */
function InteractivePersonCard({
  person,
  generationColor,
  onClick,
  onAddParent,
  onAddSibling,
}: {
  person: Person;
  generationColor: typeof GENERATION_COLORS[0];
  onClick: () => void;
  onAddParent?: () => void;
  onAddSibling?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      {/* Add Parent Button (top) */}
      {onAddParent && isHovered && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-moss text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
          onClick={(e) => {
            e.stopPropagation();
            onAddParent();
          }}
          title="Add Parent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      )}

      {/* Add Sibling Button (right) */}
      {onAddSibling && isHovered && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-moss text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
          onClick={(e) => {
            e.stopPropagation();
            onAddSibling();
          }}
          title="Add Sibling/Partner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      )}

      {/* Person Card */}
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 min-w-[140px]"
        style={{
          borderTopColor: generationColor.border,
          backgroundColor: generationColor.bg,
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar circle */}
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg shadow-md"
          style={{ backgroundColor: person.avatarColor }}
        >
          {person.initials}
        </div>

        {/* Name */}
        <h3 className="text-center font-semibold text-gray-800 text-sm mb-1">{person.name}</h3>

        {/* Role badge */}
        <div className="text-center">
          <span
            className="inline-block px-2 py-1 text-xs rounded-full font-medium"
            style={{
              backgroundColor: `${generationColor.border}40`,
              color: generationColor.label,
            }}
          >
            {person.role}
          </span>
        </div>

        {/* Birth year */}
        {person.birthYear && (
          <p className="text-center text-xs text-gray-500 mt-2">b. {person.birthYear}</p>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Family Tree Page - Main Component
 */
export default function FamilyTreePage() {
  const [appState, setAppState] = useLocalStorageState<AppState>('roots-app-state', {
    activeFamilyTreeId: initialTrees[0].id,
    trees: initialTrees,
    activitySuggestions,
    memoryCollections: memoryCollectionsData,
    lastExpandedMemory: {},
  });

  // Local state for viewing different trees on this page only
  const [viewingTreeId, setViewingTreeId] = useState(appState.activeFamilyTreeId);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const viewingTree = appState.trees.find((t) => t.id === viewingTreeId);
  const members = viewingTree?.members || [];

  // Group members by generation
  const generationGroups = useMemo(() => {
    const groups: Record<number, Person[]> = {};
    members.forEach((person) => {
      if (!groups[person.generation]) {
        groups[person.generation] = [];
      }
      groups[person.generation].push(person);
    });
    return groups;
  }, [members]);

  const generations = Object.keys(generationGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Get generation label
  const getGenerationLabel = (generation: number): string => {
    const labels = ['Grandparents', 'Parents', 'Siblings', 'Children', 'Grandchildren'];
    return labels[generation] || `Generation ${generation + 1}`;
  };

  // Handle person updates
  const handlePersonUpdate = (updated: Person) => {
    const updatedMembers = members.map((m) => (m.id === updated.id ? updated : m));
    const updatedTrees = appState.trees.map((tree) =>
      tree.id === viewingTreeId ? { ...tree, members: updatedMembers } : tree
    );
    setAppState({ ...appState, trees: updatedTrees });
  };

  // Handle person deletion
  const handlePersonDelete = (personId: string) => {
    const updatedMembers = members.filter((m) => m.id !== personId);
    const updatedTrees = appState.trees.map((tree) =>
      tree.id === viewingTreeId ? { ...tree, members: updatedMembers } : tree
    );
    setAppState({ ...appState, trees: updatedTrees });
  };

  // Handle adding new person
  const handleAddPerson = (type: 'parent' | 'sibling' | 'child', relativeTo?: Person) => {
    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name: type === 'parent' ? 'New Parent' : type === 'sibling' ? 'New Sibling' : 'New Child',
      role: type.charAt(0).toUpperCase() + type.slice(1),
      generation: relativeTo
        ? type === 'parent'
          ? relativeTo.generation - 1
          : type === 'child'
          ? relativeTo.generation + 1
          : relativeTo.generation
        : 0,
      avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      initials: 'NP',
    };

    const updatedMembers = [...members, newPerson];
    const updatedTrees = appState.trees.map((tree) =>
      tree.id === viewingTreeId ? { ...tree, members: updatedMembers } : tree
    );
    setAppState({ ...appState, trees: updatedTrees });
  };

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Tree Selector */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-moss mb-2">Family Tree</h1>
            <p className="text-gray-600 text-sm">
              View and manage your family connections
            </p>
          </div>

          {/* Tree View Selector */}
          <div className="flex justify-center gap-2 flex-wrap">
            {appState.trees.map((tree) => (
              <button
                key={tree.id}
                onClick={() => setViewingTreeId(tree.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  viewingTreeId === tree.id
                    ? 'bg-moss text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-moss hover:scale-105'
                }`}
              >
                {tree.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-moss">{members.length}</div>
              <div className="text-xs text-gray-600 mt-1">Family Members</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{generations.length}</div>
              <div className="text-xs text-gray-600 mt-1">Generations</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{viewingTree?.treeScore || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Closeness Score</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">
                {viewingTree?.activities.completed || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Activities Done</div>
            </div>
          </motion.div>
        </div>

        {/* Family Tree Diagram */}
        <div className="bg-gradient-to-br from-cream/50 to-sand/50 rounded-3xl shadow-xl p-8 border border-gray-200 overflow-x-auto mb-8">
          <div className="space-y-12 min-w-max">
            {generations.map((generation, idx) => {
              const people = generationGroups[generation];
              const colorScheme = GENERATION_COLORS[generation % GENERATION_COLORS.length];

              return (
                <div key={generation} className="relative">
                  {/* Generation label */}
                  <div className="text-center mb-6">
                    <span
                      className="inline-block px-6 py-2 rounded-full shadow-sm text-sm font-semibold"
                      style={{
                        backgroundColor: colorScheme.bg,
                        color: colorScheme.label,
                        border: `2px solid ${colorScheme.border}`,
                      }}
                    >
                      {getGenerationLabel(generation)}
                    </span>
                  </div>

                  {/* People in this generation */}
                  <div className="flex justify-center items-center gap-8 flex-wrap">
                    {people.map((person) => (
                      <InteractivePersonCard
                        key={person.id}
                        person={person}
                        generationColor={colorScheme}
                        onClick={() => setSelectedPerson(person)}
                        onAddParent={
                          generation === 0
                            ? () => handleAddPerson('parent', person)
                            : undefined
                        }
                        onAddSibling={() => handleAddPerson('sibling', person)}
                      />
                    ))}
                  </div>

                  {/* Connecting line to next generation */}
                  {idx < generations.length - 1 && (
                    <div className="flex justify-center mt-8 relative">
                      <svg width="2" height="50" className="opacity-30">
                        <line
                          x1="1"
                          y1="0"
                          x2="1"
                          y2="50"
                          stroke={colorScheme.border}
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                      </svg>
                      {/* Add Child Button */}
                      <button
                        onClick={() => handleAddPerson('child', people[0])}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-moss text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        title="Add Child"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Helper Info */}
        <div className="bg-gradient-to-br from-sand/40 to-terracotta/20 rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How to Use</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-moss mr-2">•</span>
                  <span>Click on any person card to view and edit their details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-moss mr-2">•</span>
                  <span>Hover over cards to see (+) buttons for adding family members</span>
                </li>
                <li className="flex items-start">
                  <span className="text-moss mr-2">•</span>
                  <span>Use the tabs above to switch between different family tree views</span>
                </li>
                <li className="flex items-start">
                  <span className="text-moss mr-2">•</span>
                  <span>All changes are automatically saved to your device</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Person Details Modal */}
      <AnimatePresence>
        {selectedPerson && (
          <PersonModal
            person={selectedPerson}
            onClose={() => setSelectedPerson(null)}
            onSave={handlePersonUpdate}
            onDelete={() => handlePersonDelete(selectedPerson.id)}
          />
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
