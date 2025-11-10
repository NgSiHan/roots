'use client';

import AnimatedPage from '@/components/AnimatedPage';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { AppState, Person } from '@/lib/types';
import { initialTrees, activitySuggestions, memoryCollectionsData } from '@/lib/seedData';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

// Generation colors for visual distinction
const GENERATION_COLORS = [
  { bg: '#FEF3E2', border: '#F4D9A6', label: 'rgb(212, 165, 116)' },
  { bg: '#E8F5E9', border: '#A8C69F', label: 'rgb(122, 155, 118)' },
  { bg: '#E3F2FD', border: '#90C4E8', label: 'rgb(66, 165, 245)' },
  { bg: '#FCE4EC', border: '#F8BBD0', label: 'rgb(236, 64, 122)' },
];

/**
 * Add Person Modal
 */
function AddPersonModal({
  type,
  onClose,
  onAdd,
}: {
  type: 'parents' | 'spouse' | 'child';
  onClose: () => void;
  onAdd: (person: Partial<Person>) => void;
}) {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    onAdd({
      name: name.trim(),
      birthYear,
      gender,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add {type === 'parents' ? 'Parent' : type === 'spouse' ? 'Spouse' : 'Child'}
        </h2>

        <div className="space-y-4 mb-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-moss"
              placeholder="Enter name"
              autoFocus
            />
          </div>

          {/* Birth Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birth Year (Optional)</label>
            <input
              type="number"
              value={birthYear || ''}
              onChange={(e) => setBirthYear(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-moss"
              placeholder="YYYY"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                  gender === 'male'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                  gender === 'female'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setGender('other')}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                  gender === 'other'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Other
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-moss text-white rounded-xl font-semibold hover:bg-moss/90 transition-all hover:scale-105 active:scale-95"
          >
            Add Person
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
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
            <span className="text-gray-600 font-medium">Gender</span>
            {isEditing ? (
              <select
                value={editedPerson.gender || 'other'}
                onChange={(e) =>
                  setEditedPerson({
                    ...editedPerson,
                    gender: e.target.value as 'male' | 'female' | 'other',
                  })
                }
                className="text-gray-800 font-semibold border-b border-moss focus:outline-none bg-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <span className="text-gray-800 font-semibold capitalize">
                {person.gender || 'Not specified'}
              </span>
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
  isMe,
  onClick,
  onAddParents,
  onAddSpouse,
}: {
  person: Person;
  generationColor: typeof GENERATION_COLORS[0];
  isMe: boolean;
  onClick: () => void;
  onAddParents?: () => void;
  onAddSpouse?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Person Card */}
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        transition={{ duration: 0.2 }}
        className={`bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 min-w-[140px] ${
          isMe ? 'ring-4 ring-moss ring-offset-2' : ''
        }`}
        style={{
          borderTopColor: isMe ? '#7A9B76' : generationColor.border,
          backgroundColor: isMe ? '#F0F8F0' : generationColor.bg,
        }}
        onClick={onClick}
      >
        {/* Avatar circle */}
        <div
          className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg shadow-md ${
            isMe ? 'ring-2 ring-moss' : ''
          }`}
          style={{ backgroundColor: person.avatarColor }}
        >
          {person.initials}
        </div>

        {/* Name */}
        <h3 className={`text-center font-semibold text-gray-800 text-sm mb-1 ${isMe ? 'text-moss font-bold' : ''}`}>
          {person.name}
        </h3>

        {/* Role badge */}
        <div className="text-center">
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
              isMe ? 'bg-moss text-white font-semibold' : ''
            }`}
            style={
              !isMe
                ? {
                    backgroundColor: `${generationColor.border}40`,
                    color: generationColor.label,
                  }
                : undefined
            }
          >
            {person.role}
          </span>
        </div>

        {/* Birth year */}
        {person.birthYear && (
          <p className="text-center text-xs text-gray-500 mt-2">b. {person.birthYear}</p>
        )}
      </motion.div>

      {/* Overlay buttons ON TOP of cards */}
      {isHovered && (
        <>
          {/* Add Parents Button (top) - overlaid on card edge */}
          {onAddParents && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-moss text-white rounded-full flex items-center justify-center shadow-lg hover:scale-125 transition-transform z-50"
              onClick={(e) => {
                e.stopPropagation();
                onAddParents();
              }}
              title="Add Parents"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
          )}

          {/* Add Spouse Button (right) - overlaid on card edge */}
          {onAddSpouse && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-moss text-white rounded-full flex items-center justify-center shadow-lg hover:scale-125 transition-transform z-50"
              onClick={(e) => {
                e.stopPropagation();
                onAddSpouse();
              }}
              title="Add Spouse/Partner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Helper to get gender-aware role label
 */
function getRoleLabel(type: string, gender?: string): string {
  if (type === 'parent') {
    if (gender === 'male') return 'Father';
    if (gender === 'female') return 'Mother';
    return 'Parent';
  }
  if (type === 'sibling') {
    if (gender === 'male') return 'Brother';
    if (gender === 'female') return 'Sister';
    return 'Sibling';
  }
  if (type === 'child') {
    if (gender === 'male') return 'Son';
    if (gender === 'female') return 'Daughter';
    return 'Child';
  }
  return 'Spouse';
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
    albums: {},
    lastExpandedMemory: {},
    lastExpandedAlbum: {},
    checkIns: [],
    notifications: [],
    positiveMoments: [],
  });

  // Local state for viewing different trees on this page only
  const [viewingTreeId, setViewingTreeId] = useState(appState.activeFamilyTreeId);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [addingPersonType, setAddingPersonType] = useState<'parents' | 'spouse' | 'child' | null>(null);
  const [addingPersonContext, setAddingPersonContext] = useState<{ relativeTo?: Person; generation?: number } | null>(null);

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

  // Calculate total stats
  const totalMembers = members.length;
  const totalGenerations = generations.length;

  // Check if person is "Me"
  const isMe = (person: Person) => person.role.toLowerCase() === 'me';

  // Group people by couples for display
  const groupByCouples = (people: Person[]): Person[][] => {
    const couples: Person[][] = [];
    const processed = new Set<string>();

    people.forEach((person) => {
      if (processed.has(person.id)) return;

      const spouse = person.spouseId ? people.find((p) => p.id === person.spouseId) : null;

      if (spouse && !processed.has(spouse.id)) {
        couples.push([person, spouse]);
        processed.add(person.id);
        processed.add(spouse.id);
      } else if (!processed.has(person.id)) {
        couples.push([person]);
        processed.add(person.id);
      }
    });

    return couples;
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

  // Handle add person from modal
  const handleAddPerson = (personData: Partial<Person>) => {
    if (!addingPersonContext) return;

    const { relativeTo, generation } = addingPersonContext;

    let newPeople: Person[] = [];
    let updatedMembers = members;

    if (addingPersonType === 'parents' && relativeTo) {
      const initials = personData.name?.split(' ').map((n) => n[0]).join('') || 'NP';
      const role = getRoleLabel('parent', personData.gender);

      const parent: Person = {
        id: `person-${Date.now()}`,
        name: personData.name || 'New Parent',
        role,
        birthYear: personData.birthYear,
        generation: relativeTo.generation - 1,
        avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        initials,
        gender: personData.gender,
      };

      newPeople = [parent];
    } else if (addingPersonType === 'spouse' && relativeTo) {
      const initials = personData.name?.split(' ').map((n) => n[0]).join('') || 'NS';

      const spouse: Person = {
        id: `person-${Date.now()}`,
        name: personData.name || 'New Spouse',
        role: 'Spouse',
        birthYear: personData.birthYear,
        generation: relativeTo.generation, // SAME generation as partner
        avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        initials,
        gender: personData.gender,
        spouseId: relativeTo.id,
      };

      // Update both people to link to each other
      const updatedRelativeTo = { ...relativeTo, spouseId: spouse.id };
      updatedMembers = members.map((m) => (m.id === relativeTo.id ? updatedRelativeTo : m));

      newPeople = [spouse];
    } else if (addingPersonType === 'child' && generation !== undefined) {
      const initials = personData.name?.split(' ').map((n) => n[0]).join('') || 'NC';
      const role = getRoleLabel('child', personData.gender);

      const child: Person = {
        id: `person-${Date.now()}`,
        name: personData.name || 'New Child',
        role,
        birthYear: personData.birthYear,
        generation: generation + 1,
        avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        initials,
        gender: personData.gender,
      };

      newPeople = [child];
    }

    const finalMembers = [...updatedMembers, ...newPeople];
    const updatedTrees = appState.trees.map((tree) =>
      tree.id === viewingTreeId ? { ...tree, members: finalMembers } : tree
    );
    setAppState({ ...appState, trees: updatedTrees });
  };

  // Open add person modal
  const openAddPersonModal = (type: 'parents' | 'spouse' | 'child', context: typeof addingPersonContext) => {
    setAddingPersonType(type);
    setAddingPersonContext(context);
  };

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Tree Selector */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-moss mb-2">Family Tree</h1>
            <p className="text-gray-600 text-sm">View and manage your family connections</p>
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
              <div className="text-3xl font-bold text-moss">{totalMembers}</div>
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
              <div className="text-3xl font-bold text-blue-600">{totalGenerations}</div>
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
          <div className="space-y-16 min-w-max relative">
            {generations.map((generation, idx) => {
              const people = generationGroups[generation];
              const couples = groupByCouples(people);
              const colorIndex = Math.abs(generation) % GENERATION_COLORS.length;
              const colorScheme = GENERATION_COLORS[colorIndex] || GENERATION_COLORS[0];
              const connectionId = `gen-${generation}-to-${generation + 1}`;

              // Get next generation's people for line drawing
              const nextGenPeople = generationGroups[generation + 1] || [];
              const nextGenCouples = groupByCouples(nextGenPeople);

              return (
                <div key={generation} className="relative">
                  {/* People in this generation - grouped by couples */}
                  <div className="flex justify-center items-center gap-12 flex-wrap">
                    {couples.map((couple, coupleIdx) => (
                      <div key={coupleIdx} className="relative flex items-center gap-6">
                        {couple.map((person) => (
                          <InteractivePersonCard
                            key={person.id}
                            person={person}
                            generationColor={colorScheme}
                            isMe={isMe(person)}
                            onClick={() => setSelectedPerson(person)}
                            onAddParents={
                              idx === 0 || generation === Math.min(...generations)
                                ? () => openAddPersonModal('parents', { relativeTo: person })
                                : undefined
                            }
                            onAddSpouse={
                              !person.spouseId
                                ? () => openAddPersonModal('spouse', { relativeTo: person })
                                : undefined
                            }
                          />
                        ))}

                        {/* Horizontal line connecting spouses */}
                        {couple.length === 2 && (
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            width="60"
                            height="2"
                          >
                            <line
                              x1="0"
                              y1="1"
                              x2="60"
                              y2="1"
                              stroke={colorScheme.border}
                              strokeWidth="2"
                            />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Connecting lines to next generation - proper genealogy style */}
                  {idx < generations.length - 1 && nextGenPeople.length > 0 && (
                    <div
                      className="relative mt-8"
                      onMouseEnter={() => setHoveredConnection(connectionId)}
                      onMouseLeave={() => setHoveredConnection(null)}
                    >
                      {/* Genealogy connecting lines */}
                      <svg
                        width="100%"
                        height="80"
                        className="absolute left-0 top-0 pointer-events-none"
                        style={{ minWidth: '100%' }}
                      >
                        {/* Step 1: Vertical line down from parent generation center */}
                        <line
                          x1="50%"
                          y1="0"
                          x2="50%"
                          y2="30"
                          stroke={colorScheme.border}
                          strokeWidth="2"
                          className="opacity-50"
                        />

                        {/* Step 2: Horizontal line spanning across (above children) */}
                        {nextGenPeople.length > 1 ? (
                          <line
                            x1="25%"
                            y1="30"
                            x2="75%"
                            y2="30"
                            stroke={colorScheme.border}
                            strokeWidth="2"
                            className="opacity-50"
                          />
                        ) : null}

                        {/* Step 3: Vertical lines down to children positions */}
                        {nextGenCouples.map((couple, coupleIdx) => {
                          const totalCouples = nextGenCouples.length;
                          let xPercent: number;

                          if (totalCouples === 1) {
                            xPercent = 50;
                          } else {
                            // Distribute couples evenly
                            const startPercent = 25;
                            const endPercent = 75;
                            const spacing = (endPercent - startPercent) / (totalCouples - 1);
                            xPercent = startPercent + coupleIdx * spacing;
                          }

                          return (
                            <line
                              key={coupleIdx}
                              x1={`${xPercent}%`}
                              y1="30"
                              x2={`${xPercent}%`}
                              y2="80"
                              stroke={colorScheme.border}
                              strokeWidth="2"
                              className="opacity-50"
                            />
                          );
                        })}
                      </svg>

                      {/* Add Child Button - positioned on the horizontal line */}
                      <div className="relative h-20 flex items-center justify-center">
                        <AnimatePresence>
                          {hoveredConnection === connectionId && (
                            <motion.button
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              onClick={() => openAddPersonModal('child', { generation })}
                              className="w-10 h-10 bg-moss text-white rounded-full flex items-center justify-center shadow-lg hover:scale-125 transition-transform z-40 pointer-events-auto"
                              title="Add Child"
                              style={{ marginTop: '-20px' }}
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
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
              <svg
                className="w-5 h-5 text-terracotta"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
                  <span>
                    Hover over cards to see add buttons: top for parents, side for spouse/partner
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-moss mr-2">•</span>
                  <span>Hover over connecting lines between generations to add children</span>
                </li>
                <li className="flex items-start">
                  <span className="text-moss mr-2">•</span>
                  <span>Use tabs above to switch between different family trees</span>
                </li>
                <li className="flex items-start">
                  <span className="text-moss mr-2">•</span>
                  <span>Cards with green rings are you (Me) - easy to spot!</span>
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

      {/* Add Person Modal */}
      <AnimatePresence>
        {addingPersonType && (
          <AddPersonModal
            type={addingPersonType}
            onClose={() => {
              setAddingPersonType(null);
              setAddingPersonContext(null);
            }}
            onAdd={handleAddPerson}
          />
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
