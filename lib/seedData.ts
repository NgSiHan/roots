import { FamilyTree, Activity, MemoryCollection, Album } from './types';

/**
 * Seed data for ROOTS app
 */

export const initialTrees: FamilyTree[] = [
  {
    id: 'my-family',
    name: 'My Family',
    description: 'Spouse & Children',
    treeScore: 72,
    logCount: 0,
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
    logCount: 0,
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
    logCount: 0,
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
    category: 'fun',
    duration: '1-2 hours',
    tags: ['Indoor', 'All ages', 'Interactive'],
  },
  {
    id: 'act2',
    title: 'Cook a Meal Together',
    description: "Choose a family recipe and prepare it together. Don't forget to share stories while cooking!",
    category: 'bonding',
    duration: '2-3 hours',
    tags: ['Indoor', 'Food', 'Quality time'],
  },
  {
    id: 'act3',
    title: 'Nature Walk',
    description: 'Take a walk in a nearby park or nature trail. Observe the trees, birds, and enjoy fresh air.',
    category: 'health',
    duration: '1 hour',
    tags: ['Outdoor', 'Active', 'Refreshing'],
  },
  {
    id: 'act4',
    title: 'Story Time',
    description: 'Share stories from your childhood or ask elders about their memories growing up.',
    category: 'bonding',
    duration: '30 mins',
    tags: ['Indoor', 'Memories', 'Connection'],
  },
  {
    id: 'act5',
    title: 'DIY Craft Project',
    description: 'Create something together: paint, draw, build with clay, or make greeting cards.',
    category: 'creative',
    duration: '1-2 hours',
    tags: ['Indoor', 'Hands-on', 'Artistic'],
  },
  {
    id: 'act6',
    title: 'Family Movie Marathon',
    description: 'Pick a movie series or theme and watch together with popcorn and snacks!',
    category: 'fun',
    duration: '3-4 hours',
    tags: ['Indoor', 'Relaxing', 'Entertainment'],
  },
  {
    id: 'act7',
    title: 'Learn a New Skill Together',
    description: 'Pick a skill (origami, knitting, coding) and teach each other or learn from online tutorials.',
    category: 'learning',
    duration: '1-2 hours',
    tags: ['Indoor', 'Educational', 'Growth'],
  },
  {
    id: 'act8',
    title: 'Morning Yoga Session',
    description: 'Start the day with gentle stretches and breathing exercises together.',
    category: 'health',
    duration: '30 mins',
    tags: ['Indoor/Outdoor', 'Wellness', 'Peaceful'],
  },
  {
    id: 'act9',
    title: 'Backyard Picnic',
    description: 'Prepare simple snacks and have a cozy picnic in your backyard or balcony.',
    category: 'fun',
    duration: '1 hour',
    tags: ['Outdoor', 'Food', 'Casual'],
  },
  {
    id: 'act10',
    title: 'Family Photo Session',
    description: 'Take fun photos together, try different poses, and create memories to cherish.',
    category: 'bonding',
    duration: '45 mins',
    tags: ['Indoor/Outdoor', 'Creative', 'Memories'],
  },
  {
    id: 'act11',
    title: 'Bike Ride Adventure',
    description: 'Explore your neighborhood or a nearby trail on bikes together.',
    category: 'health',
    duration: '1-2 hours',
    tags: ['Outdoor', 'Active', 'Adventure'],
  },
  {
    id: 'act12',
    title: 'Trivia Quiz Night',
    description: 'Create custom trivia questions about family history and general knowledge.',
    category: 'learning',
    duration: '1 hour',
    tags: ['Indoor', 'Brain game', 'Interactive'],
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

// Helper function to generate placeholder photos
function generatePhotos(baseId: string, count: number, prefix: string): any[] {
  const colors = ['#E8C4D4', '#F5E6D3', '#E8D4C4', '#C8B6A6', '#A8C69F', '#B8D4E8', '#D4E8C4', '#E8D4F5', '#F5D6A8', '#C4F5E8'];
  return Array.from({ length: count }, (_, i) => ({
    id: `${baseId}-${i}`,
    url: '',
    caption: `${prefix} ${i + 1}`,
    color: colors[i % colors.length],
  }));
}

export const albumsData: Record<string, Album[]> = {
  'my-family': [
    {
      id: 'summer-2024',
      title: 'Summer Vacation 2024',
      description: 'Our amazing summer trip to the beach',
      coverColor: '#87CEEB',
      lastUpdated: '2 days ago',
      memories: [
        {
          id: 'beach-day',
          title: 'Beach Day',
          date: 'July 15, 2024',
          photos: generatePhotos('beach', 13, 'Beach photo'),
        },
        {
          id: 'theme-park',
          title: 'Theme Park Adventure',
          date: 'July 18, 2024',
          photos: generatePhotos('theme', 18, 'Theme park'),
        },
        {
          id: 'beach-sunset',
          title: 'Sunset at the Beach',
          date: 'July 20, 2024',
          photos: generatePhotos('sunset', 8, 'Sunset'),
        },
      ],
    },
    {
      id: 'sophie-firsts',
      title: "Sophie's Firsts",
      description: 'Milestone moments with our little one',
      coverColor: '#FFB6C1',
      lastUpdated: '1 week ago',
      memories: [
        {
          id: 'first-steps',
          title: 'First Steps',
          date: 'March 10, 2023',
          photos: generatePhotos('steps', 10, 'First steps'),
        },
        {
          id: 'first-words',
          title: 'First Words',
          date: 'February 14, 2023',
          photos: generatePhotos('words', 6, 'First words'),
        },
        {
          id: 'first-birthday',
          title: 'First Birthday Party',
          date: 'January 1, 2023',
          photos: generatePhotos('bday', 25, 'Birthday'),
        },
      ],
    },
    {
      id: 'date-nights-2024',
      title: 'Date Nights 2024',
      description: 'Quality time together',
      coverColor: '#DDA0DD',
      lastUpdated: '3 days ago',
      memories: [
        {
          id: 'anniversary',
          title: 'Anniversary Dinner',
          date: 'June 5, 2024',
          photos: generatePhotos('anniversary', 12, 'Anniversary'),
        },
        {
          id: 'movie-night',
          title: 'Movie Night',
          date: 'June 12, 2024',
          photos: generatePhotos('movie', 5, 'Movie night'),
        },
      ],
    },
  ],
  'parents-siblings': [
    {
      id: 'holidays-2024',
      title: 'Holiday Celebrations 2024',
      description: 'Special moments during the holidays',
      coverColor: '#98FB98',
      lastUpdated: '1 week ago',
      memories: [
        {
          id: 'cny-2024',
          title: 'Chinese New Year 2024',
          date: 'February 10, 2024',
          photos: generatePhotos('cny', 20, 'CNY'),
        },
        {
          id: 'christmas-2023',
          title: 'Christmas Dinner 2023',
          date: 'December 25, 2023',
          photos: generatePhotos('xmas', 15, 'Christmas'),
        },
      ],
    },
    {
      id: 'game-nights',
      title: 'Family Game Nights',
      description: 'Fun times playing board games',
      coverColor: '#FFD700',
      lastUpdated: '4 days ago',
      memories: [
        {
          id: 'monopoly-championship',
          title: 'Monopoly Championship',
          date: 'May 20, 2024',
          photos: generatePhotos('monopoly', 8, 'Monopoly'),
        },
        {
          id: 'poker-night',
          title: 'Poker Night',
          date: 'May 27, 2024',
          photos: generatePhotos('poker', 10, 'Poker'),
        },
      ],
    },
  ],
  'extended-family': [
    {
      id: 'reunions-2024',
      title: 'Family Reunions 2024',
      description: 'Getting together with the whole family',
      coverColor: '#FFA07A',
      lastUpdated: '2 weeks ago',
      memories: [
        {
          id: 'summer-bbq',
          title: 'Summer BBQ',
          date: 'July 4, 2024',
          photos: generatePhotos('bbq', 22, 'BBQ'),
        },
        {
          id: 'grandma-bday',
          title: "Grandma's 75th Birthday",
          date: 'June 15, 2024',
          photos: generatePhotos('gma-bday', 30, "Grandma's birthday"),
        },
      ],
    },
  ],
};
