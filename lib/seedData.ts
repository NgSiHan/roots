import { FamilyTree, Activity, MemoryCollection } from './types';

/**
 * Seed data for ROOTS app
 */

export const initialTrees: FamilyTree[] = [
  {
    id: 'tan-family',
    name: 'Tan Family',
    description: 'Parents & Siblings',
    treeScore: 45,
    members: [
      {
        id: 'gf1',
        name: 'Wei Chen',
        role: 'Grandfather',
        birthYear: 1945,
        generation: 0,
        avatarColor: '#E8DCC4',
        initials: 'WC',
      },
      {
        id: 'gm1',
        name: 'Mei Ling',
        role: 'Grandmother',
        birthYear: 1948,
        generation: 0,
        avatarColor: '#D4A574',
        initials: 'ML',
      },
      {
        id: 'dad',
        name: 'David Tan',
        role: 'Dad',
        birthYear: 1972,
        generation: 1,
        avatarColor: '#A8C69F',
        initials: 'DT',
      },
      {
        id: 'mom',
        name: 'Sarah Tan',
        role: 'Mom',
        birthYear: 1975,
        generation: 1,
        avatarColor: '#7A9B76',
        initials: 'ST',
      },
      {
        id: 'me',
        name: 'Alex Tan',
        role: 'Me',
        birthYear: 1998,
        generation: 2,
        avatarColor: '#C8B6A6',
        initials: 'AT',
      },
      {
        id: 'sibling1',
        name: 'Emma Tan',
        role: 'Sister',
        birthYear: 2001,
        generation: 2,
        avatarColor: '#B8A99A',
        initials: 'ET',
      },
    ],
    activities: {
      completed: 3,
      skipped: 1,
    },
  },
  {
    id: 'lim-family',
    name: 'Lim Family',
    description: 'My Own Family',
    treeScore: 72,
    members: [
      {
        id: 'me2',
        name: 'Alex Tan',
        role: 'Me',
        birthYear: 1998,
        generation: 0,
        avatarColor: '#C8B6A6',
        initials: 'AT',
      },
      {
        id: 'spouse',
        name: 'Jamie Lim',
        role: 'Spouse',
        birthYear: 1997,
        generation: 0,
        avatarColor: '#A8C69F',
        initials: 'JL',
      },
      {
        id: 'child1',
        name: 'Sophie',
        role: 'Daughter',
        birthYear: 2022,
        generation: 1,
        avatarColor: '#E8C4D4',
        initials: 'S',
      },
    ],
    activities: {
      completed: 8,
      skipped: 2,
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
  'tan-family': [
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
  'lim-family': [
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
};
