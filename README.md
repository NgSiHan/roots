# 🌳 ROOTS - Family Bonding App

A beautiful MVP web app for strengthening family relationships through a gamified "Tree of Love" experience, visual family trees, suggested activities, and memory collections.

## 🎯 Concept

ROOTS is a family bonding app where users can:
- Grow a visual "Tree of Love" that represents relationship closeness
- View their family connections in a beautiful genealogy chart
- Get activity suggestions for quality family time
- Organize and cherish family memories in photo collections
- Manage multiple family trees (e.g., parents & siblings, own family with spouse & children)

## ✨ Features

### 1. Tree of Love 🌳
- Interactive visual tree that grows based on a "closeness score" (0-100)
- Three growth stages: sapling (0-20), growing (21-60), full tree (61-100)
- Animated growth transitions with leaves, blossoms, and hearts
- Log positive moments to increase the tree's growth
- Smooth animations powered by Framer Motion

### 2. Family Tree 👨‍👩‍👧‍👦
- Modern genealogy chart layout
- Person cards with avatars (initials), names, roles, and birth years
- Organized by generation with connecting lines
- Switch between multiple family trees via dropdown
- Hover animations on person cards
- Pastel color scheme with soft shadows

### 3. Activities ✨
- Card stack interface with swipe/dismiss animations
- Activity suggestions for family bonding
- Mark activities as "Done" or "Skip"
- Track completed and skipped activities
- Smooth card animations and transitions

### 4. Memories 📸
- Accordion-based photo collections
- Expandable sections for different memory categories
- Photo grid layout with placeholder images
- Statistics showing total collections and photos
- Persist last-opened collection per family tree

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **State Management**: React Hooks + localStorage
- **No Backend**: All data stored in browser localStorage

## 🎨 Design

- **Visual Style**: Soft, friendly "Forest app" vibes
- **Colors**:
  - Cream/beige backgrounds (#F5F1E8)
  - Sage green (#A8C69F)
  - Moss green (#7A9B76)
  - Sand (#E8DCC4)
  - Terracotta accents (#D4A574)
- **Components**: Rounded cards with soft shadows
- **Typography**: System font stack for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
roots/
├── app/
│   ├── layout.tsx              # Root layout with header & navigation
│   ├── page.tsx                # Home page (redirects to /tree)
│   ├── globals.css             # Global styles & Tailwind imports
│   ├── tree/
│   │   └── page.tsx           # Tree of Love page
│   ├── family-tree/
│   │   └── page.tsx           # Family Tree genealogy view
│   ├── activities/
│   │   └── page.tsx           # Activities card stack
│   └── memories/
│       └── page.tsx           # Memories accordion
├── components/
│   ├── AnimatedPage.tsx        # Page transition wrapper
│   ├── Navigation.tsx          # Bottom tab navigation
│   ├── FamilyTreeSelector.tsx  # Dropdown for switching trees
│   ├── LoveTree.tsx           # Animated tree visual
│   ├── PersonCard.tsx         # Family member card
│   └── Accordion.tsx          # Accordion component
├── hooks/
│   └── useLocalStorageState.ts # localStorage state management hook
├── lib/
│   ├── types.ts               # TypeScript type definitions
│   └── seedData.ts            # Sample data for demo
└── [config files]
```

## 💾 Data Storage

All data is stored in the browser's `localStorage` under the key `roots-app-state`. The app state includes:

- Active family tree ID
- Array of family trees with members and scores
- Activity statistics (completed/skipped counts)
- Memory collections per tree
- Last expanded memory section per tree

### Adding Content

#### Add a New Family Tree

Edit `lib/seedData.ts` and add a new tree to the `initialTrees` array:

```typescript
{
  id: 'unique-id',
  name: 'Tree Name',
  description: 'Description',
  treeScore: 0,
  members: [/* person objects */],
  activities: { completed: 0, skipped: 0 }
}
```

#### Add Activity Suggestions

Edit the `activitySuggestions` array in `lib/seedData.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Activity Title',
  description: 'Activity description',
  tags: ['Tag1', 'Tag2']
}
```

#### Add Memory Collections

Edit the `memoryCollectionsData` object in `lib/seedData.ts`:

```typescript
'tree-id': [
  {
    id: 'collection-id',
    title: 'Collection Title',
    photoCount: 10,
    lastUpdated: '1 week ago',
    photos: [/* photo objects */]
  }
]
```

## 🎮 Usage

1. **Switch Family Trees**: Use the dropdown in the header to switch between different family trees
2. **Grow Your Tree**: Go to the Tree tab and click "Log a Positive Moment" to increase the growth score
3. **View Family**: Explore the Family Tree tab to see your family structure
4. **Try Activities**: Swipe through activity suggestions in the Activities tab
5. **Browse Memories**: Expand memory collections in the Memories tab

## 🔮 Future Enhancements

This is an MVP with localStorage only. Potential future features:

- Real backend with authentication
- Photo upload functionality
- Push notifications for activity reminders
- Social features (share trees with family)
- More tree growth stages and animations
- Activity scheduling and calendar integration
- Memory timeline view
- Export family tree as PDF
- Multi-language support

## 📝 License

This project is for demonstration purposes.

## 🙏 Acknowledgments

- Design inspired by the Forest pomodoro timer app
- Built with Next.js, Tailwind CSS, and Framer Motion
