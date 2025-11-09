import { FamilyTree, Activity, MemoryCollection } from './types';

/**
 * Seed data for ROOTS app
 */

export const initialTrees: FamilyTree[] = [
  {
    id: 'my-family',
    name: 'My Family',
    description: 'Spouse & Children',
    treeScore: 72,
    members: [
      {
        id: 'me-main',
        name: 'Alex Tan',
        role: 'Me',
        birthYear: 1998,
        generation: 0,
        avatarColor: '#C8B6A6',
        initials: 'AT',
        gender: 'male',
        spouseId: 'spouse',
      },
      {
        id: 'spouse',
        name: 'Jamie Lim',
        role: 'Spouse',
        birthYear: 1997,
        generation: 0,
        avatarColor: '#A8C69F',
        initials: 'JL',
        gender: 'female',
        spouseId: 'me-main',
      },
      {
        id: 'child1',
        name: 'Sophie',
        role: 'Daughter',
        birthYear: 2022,
        generation: 1,
        avatarColor: '#E8C4D4',
        initials: 'S',
        gender: 'female',
        parentIds: ['me-main', 'spouse'],
      },
    ],
    activities: {
      completed: 8,
      skipped: 2,
    },
  },
  {
    id: 'parents-siblings',
    name: 'Parents & Siblings',
    description: 'My parents and siblings',
    treeScore: 45,
    members: [
      // David is a child of his parents (in Extended Family tree)
      // He is at generation 0 in this tree (parent generation)
      {
        id: 'dad',
        name: 'David Tan',
        role: 'Father',
        birthYear: 1972,
        generation: 0,
        avatarColor: '#A8C69F',
        initials: 'DT',
        gender: 'male',
        spouseId: 'mom', // Married to Sarah
      },
      // Sarah married into the family (not a blood child of David's parents)
      // She is at generation 0 (same as David - spouse level)
      {
        id: 'mom',
        name: 'Sarah Tan',
        role: 'Mother',
        birthYear: 1975,
        generation: 0,
        avatarColor: '#7A9B76',
        initials: 'ST',
        gender: 'female',
        spouseId: 'dad', // Married to David
        // NO parentIds - she married into the family
      },
      // Alex is a child of both David and Sarah
      {
        id: 'me',
        name: 'Alex Tan',
        role: 'Me',
        birthYear: 1998,
        generation: 1,
        avatarColor: '#C8B6A6',
        initials: 'AT',
        gender: 'male',
        parentIds: ['dad', 'mom'], // Child of David and Sarah
      },
      // Emma is a child of both David and Sarah
      {
        id: 'sibling1',
        name: 'Emma Tan',
        role: 'Sister',
        birthYear: 2001,
        generation: 1,
        avatarColor: '#B8A99A',
        initials: 'ET',
        gender: 'female',
        parentIds: ['dad', 'mom'], // Child of David and Sarah
      },
    ],
    activities: {
      completed: 3,
      skipped: 1,
    },
  },
  {
    id: 'extended-family',
    name: 'Extended Family',
    description: 'Grandparents, aunts, uncles & cousins',
    treeScore: 38,
    members: [
      // Wei and Mei are the grandparents (generation 0)
      {
        id: 'gf1',
        name: 'Wei Chen',
        role: 'Grandfather',
        birthYear: 1945,
        generation: 0,
        avatarColor: '#E8DCC4',
        initials: 'WC',
        gender: 'male',
        spouseId: 'gm1', // Married to Mei Ling
      },
      {
        id: 'gm1',
        name: 'Mei Ling',
        role: 'Grandmother',
        birthYear: 1948,
        generation: 0,
        avatarColor: '#D4A574',
        initials: 'ML',
        gender: 'female',
        spouseId: 'gf1', // Married to Wei Chen
      },
      // Michael is a blood child of Wei and Mei (has parentIds)
      {
        id: 'uncle1',
        name: 'Michael Tan',
        role: 'Uncle',
        birthYear: 1970,
        generation: 1,
        avatarColor: '#A8B6C6',
        initials: 'MT',
        gender: 'male',
        parentIds: ['gf1', 'gm1'], // Child of Wei and Mei
        spouseId: 'aunt1', // Married to Lisa
      },
      // Lisa married into the family (NO parentIds - she's not Wei and Mei's child)
      // She is at generation 1 (same as Michael - spouse level)
      {
        id: 'aunt1',
        name: 'Lisa Chen',
        role: 'Aunt',
        birthYear: 1973,
        generation: 1,
        avatarColor: '#C6A8B6',
        initials: 'LC',
        gender: 'female',
        spouseId: 'uncle1', // Married to Michael
        // NO parentIds - she married into the family
      },
      // Ryan is a child of Michael and Lisa
      {
        id: 'cousin1',
        name: 'Ryan Tan',
        role: 'Cousin',
        birthYear: 1999,
        generation: 2,
        avatarColor: '#B6C6A8',
        initials: 'RT',
        gender: 'male',
        parentIds: ['uncle1', 'aunt1'], // Child of Michael and Lisa
      },
      // Olivia is a child of Michael and Lisa
      {
        id: 'cousin2',
        name: 'Olivia Tan',
        role: 'Cousin',
        birthYear: 2003,
        generation: 2,
        avatarColor: '#C6B6A8',
        initials: 'OT',
        gender: 'female',
        parentIds: ['uncle1', 'aunt1'], // Child of Michael and Lisa
      },
    ],
    activities: {
      completed: 2,
      skipped: 3,
    },
  },
];

export const activitySuggestions: Activity[] = [
  {
    id: 'act1',
    title: 'Family Board Game Night',
    description: 'Pick a classic board game and play together. Try Monopoly, Scrabble, or a card game!',
    tags: ['Indoor', '1-2 hours', 'All ages'],
  },
  {
    id: 'act2',
    title: 'Cook a Meal Together',
    description: "Choose a family recipe and prepare it together. Don't forget to share stories while cooking!",
    tags: ['Indoor', '2-3 hours', 'Creative'],
  },
  {
    id: 'act3',
    title: 'Nature Walk',
    description: 'Take a walk in a nearby park or nature trail. Observe the trees, birds, and enjoy fresh air.',
    tags: ['Outdoor', '1 hour', 'Active'],
  },
  {
    id: 'act4',
    title: 'Story Time',
    description: 'Share stories from your childhood or ask elders about their memories growing up.',
    tags: ['Indoor', '30 mins', 'Bonding'],
  },
  {
    id: 'act5',
    title: 'DIY Craft Project',
    description: 'Create something together: paint, draw, build with clay, or make greeting cards.',
    tags: ['Indoor', '1-2 hours', 'Creative'],
  },
];

export const memoryCollectionsData: Record<string, MemoryCollection[]> = {
  'my-family': [
    {
      id: 'baby-first',
      title: "Sophie's Firsts",
      photoCount: 38,
      lastUpdated: '1 day ago',
      photos: [
        { id: 'p11', url: '', caption: 'First steps', color: '#E8C4D4' },
        { id: 'p12', url: '', caption: 'First words', color: '#F5E6D3' },
        { id: 'p13', url: '', caption: 'First birthday', color: '#E8D4C4' },
      ],
    },
    {
      id: 'date-nights',
      title: 'Date Nights',
      photoCount: 15,
      lastUpdated: '5 days ago',
      photos: [
        { id: 'p14', url: '', caption: 'Anniversary dinner', color: '#C8B6A6' },
        { id: 'p15', url: '', caption: 'Sunset walk', color: '#D4C4A6' },
      ],
    },
  ],
  'parents-siblings': [
    {
      id: 'game-nights',
      title: 'Game Nights',
      photoCount: 12,
      lastUpdated: '3 days ago',
      photos: [
        { id: 'p1', url: '', caption: 'Monopoly championship 2023', color: '#A8C69F' },
        { id: 'p2', url: '', caption: 'Dad winning at Scrabble', color: '#7A9B76' },
        { id: 'p3', url: '', caption: 'Family poker night', color: '#E8DCC4' },
        { id: 'p4', url: '', caption: 'Emma teaching us new game', color: '#D4A574' },
      ],
    },
    {
      id: 'holidays',
      title: 'Holidays',
      photoCount: 24,
      lastUpdated: '1 week ago',
      photos: [
        { id: 'p5', url: '', caption: 'Chinese New Year 2024', color: '#E8C4D4' },
        { id: 'p6', url: '', caption: 'Beach vacation', color: '#B8D4E8' },
        { id: 'p7', url: '', caption: 'Christmas dinner', color: '#C8B6A6' },
      ],
    },
    {
      id: 'everyday',
      title: 'Everyday Moments',
      photoCount: 45,
      lastUpdated: '2 days ago',
      photos: [
        { id: 'p8', url: '', caption: 'Sunday breakfast', color: '#F5E6D3' },
        { id: 'p9', url: '', caption: 'Gardening with Grandma', color: '#C8E8C4' },
        { id: 'p10', url: '', caption: 'Movie night', color: '#D4D4E8' },
      ],
    },
  ],
  'extended-family': [
    {
      id: 'reunions',
      title: 'Family Reunions',
      photoCount: 28,
      lastUpdated: '2 weeks ago',
      photos: [
        { id: 'p16', url: '', caption: 'Summer BBQ 2024', color: '#F5D6A8' },
        { id: 'p17', url: '', caption: 'Grandma\'s birthday', color: '#E8C4F5' },
        { id: 'p18', url: '', caption: 'Cousins playdate', color: '#C4F5E8' },
      ],
    },
  ],
};
