'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Tree of Love - Log-based growth stages
 * Stage 1 (0-9 logs): Seed with 10 individual roots
 * Stage 2 (10-19 logs): Sprout with stem + leaves (roots still visible)
 * Stage 3 (20-69 logs): Young Tree with branches and individual leaves
 * Stage 4 (70+ logs): Adult tree with unlimited growth
 */

interface LoveTreeProps {
  score: number; // This is actually logCount now
}

export default function LoveTree({ score }: LoveTreeProps) {
  const logCount = score; // score is actually logCount

  // Determine stage based on log count
  const stage = useMemo(() => {
    if (logCount < 10) return 1; // Seed
    if (logCount < 20) return 2; // Sprout
    if (logCount < 70) return 3; // Young Tree
    return 4; // Adult Tree
  }, [logCount]);

  const stageName = useMemo(() => {
    const names = ['Seed', 'Sprout', 'Young Tree', 'Adult Tree'];
    return names[stage - 1];
  }, [stage]);

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative"
        >
          {stage === 1 && <SeedStage logCount={logCount} />}
          {stage === 2 && <SproutStage logCount={logCount} />}
          {stage === 3 && <YoungTreeStage logCount={logCount} />}
          {stage === 4 && <AdultTreeStage logCount={logCount} />}
        </motion.div>
      </AnimatePresence>

      {/* Stage label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <motion.div
          key={stageName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
        >
          <p className="text-sm font-semibold text-moss">{stageName}</p>
        </motion.div>
      </div>
    </div>
  );
}

// Stage 1: Seed with 10 individual roots (0-9 logs) - with branching
function SeedStage({ logCount }: { logCount: number }) {
  const rootCount = Math.min(logCount, 10);

  // 10 roots with realistic branching pattern
  // Some grow directly from base, others branch from existing roots
  const rootPaths = [
    { path: "M 150 200 L 150 240 L 140 260 L 130 280", desc: "Root 1 - left main" },
    { path: "M 150 200 L 150 240 L 160 260 L 170 280", desc: "Root 2 - right main" },
    { path: "M 140 260 L 120 275 L 110 290", desc: "Root 3 - branches from root 1" },
    { path: "M 140 260 L 135 280 L 125 295", desc: "Root 4 - branches from root 1" },
    { path: "M 160 260 L 180 275 L 190 290", desc: "Root 5 - branches from root 2" },
    { path: "M 160 260 L 165 280 L 175 295", desc: "Root 6 - branches from root 2" },
    { path: "M 110 290 L 95 300 L 85 310", desc: "Root 7 - branches from root 3" },
    { path: "M 190 290 L 205 300 L 215 310", desc: "Root 8 - branches from root 5" },
    { path: "M 150 240 L 150 265 L 145 285 L 140 300", desc: "Root 9 - center branch" },
    { path: "M 145 285 L 150 295 L 155 305", desc: "Root 10 - branches from root 9" },
  ];

  return (
    <svg width="300" height="350" viewBox="0 0 300 350" className="drop-shadow-lg">
      {/* Ground line */}
      <line x1="50" y1="200" x2="250" y2="200" stroke="#C8B6A6" strokeWidth="3" />

      {/* Soil mound */}
      <ellipse cx="150" cy="210" rx="60" ry="30" fill="#D4A574" opacity="0.6" />

      {/* Seed */}
      <motion.g
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ellipse cx="150" cy="200" rx="15" ry="20" fill="#8B6F47" />
        <ellipse cx="150" cy="200" rx="12" ry="16" fill="#A0826B" />
      </motion.g>

      {/* 10 individual roots with branching pattern */}
      <g opacity="0.6">
        {rootPaths.slice(0, rootCount).map((root, i) => (
          <motion.path
            key={i}
            d={root.path}
            stroke="#7A6F5D"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
          />
        ))}
      </g>

      {/* Tiny sprout emerging */}
      <motion.path
        d="M 150 195 Q 150 180 155 175"
        stroke="#A8C69F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.circle
        cx="155"
        cy="175"
        r="3"
        fill="#A8C69F"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
      />
    </svg>
  );
}

// Stage 2: Sprout with stem + 10 leaves (10-19 logs) - roots still visible
function SproutStage({ logCount }: { logCount: number }) {
  const leafCount = Math.min(logCount - 10, 10);

  // Keep all 10 roots from Seed stage with branching pattern
  const rootPaths = [
    "M 150 250 L 150 290 L 140 310 L 130 330",
    "M 150 250 L 150 290 L 160 310 L 170 330",
    "M 140 310 L 120 325 L 110 340",
    "M 140 310 L 135 330 L 125 345",
    "M 160 310 L 180 325 L 190 340",
    "M 160 310 L 165 330 L 175 345",
    "M 110 340 L 95 350 L 85 360",
    "M 190 340 L 205 350 L 215 360",
    "M 150 290 L 150 315 L 145 335 L 140 350",
    "M 145 335 L 150 345 L 155 355",
  ];

  return (
    <svg width="300" height="350" viewBox="0 0 300 350" className="drop-shadow-lg">
      {/* Ground */}
      <line x1="50" y1="250" x2="250" y2="250" stroke="#C8B6A6" strokeWidth="3" />
      <ellipse cx="150" cy="260" rx="70" ry="35" fill="#D4A574" opacity="0.6" />

      {/* All 10 roots from Seed stage - still visible */}
      <g opacity="0.3">
        {rootPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            stroke="#7A6F5D"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* Main stem */}
      <motion.path
        d="M 150 250 Q 148 220 150 190 Q 152 160 150 130"
        stroke="#7A9B76"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Leaves alternating left/right with borders (10 total) */}
      {Array.from({ length: leafCount }).map((_, i) => {
        const stemY = 230 - i * 11; // Space leaves along stem
        const isLeft = i % 2 === 0;
        const x = isLeft ? 140 : 160;
        const rotation = isLeft ? -30 : 30;

        return (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            {/* Leaf with dark border */}
            <ellipse
              cx={x}
              cy={stemY}
              rx="12"
              ry="20"
              fill="#6B8E65"
              stroke="#2D4A28"
              strokeWidth="1.5"
              transform={`rotate(${rotation} ${x} ${stemY})`}
            />
            <ellipse
              cx={x}
              cy={stemY}
              rx="10"
              ry="18"
              fill="#A8C69F"
              transform={`rotate(${rotation} ${x} ${stemY})`}
            />
          </motion.g>
        );
      })}
    </svg>
  );
}

// Stage 3: Young Tree with 5 branches × 10 individual leaves each (20-69 logs)
function YoungTreeStage({ logCount }: { logCount: number }) {
  // First branch starts with 10 leaves (from Sprout transition)
  // Each additional log adds to subsequent branches
  const totalLeaves = Math.min(logCount - 20 + 10, 60); // +10 for Sprout transition

  // Keep all 10 roots from Seed stage - still visible
  const rootPaths = [
    "M 150 280 L 150 320 L 140 340 L 130 360",
    "M 150 280 L 150 320 L 160 340 L 170 360",
    "M 140 340 L 120 355 L 110 370",
    "M 140 340 L 135 360 L 125 375",
    "M 160 340 L 180 355 L 190 370",
    "M 160 340 L 165 360 L 175 375",
    "M 110 370 L 95 380 L 85 390",
    "M 190 370 L 205 380 L 215 390",
    "M 150 320 L 150 345 L 145 365 L 140 380",
    "M 145 365 L 150 375 L 155 385",
  ];

  // Calculate which branches are active and how many leaves each has
  const branches = [
    {
      active: true, // Always active - has 10 leaves from Sprout transition
      leafCount: 10,
      path: "M 145 140 Q 130 125 115 120 L 75 110",
      startX: 115, startY: 120, endX: 75, endY: 110,
    },
    {
      active: totalLeaves > 10,
      leafCount: Math.min(Math.max(0, totalLeaves - 10), 10),
      path: "M 146 140 Q 160 125 175 120 L 215 110",
      startX: 175, startY: 120, endX: 215, endY: 110,
    },
    {
      active: totalLeaves > 20,
      leafCount: Math.min(Math.max(0, totalLeaves - 20), 10),
      path: "M 145 100 Q 130 90 115 85 L 85 75",
      startX: 115, startY: 85, endX: 85, endY: 75,
    },
    {
      active: totalLeaves > 30,
      leafCount: Math.min(Math.max(0, totalLeaves - 30), 10),
      path: "M 147 100 Q 160 90 175 85 L 205 75",
      startX: 175, startY: 85, endX: 205, endY: 75,
    },
    {
      active: totalLeaves > 40,
      leafCount: Math.min(Math.max(0, totalLeaves - 40), 10),
      path: "M 146 70 Q 146 60 145 50 L 145 30",
      startX: 145, startY: 50, endX: 145, endY: 30,
    },
  ];

  return (
    <svg width="300" height="350" viewBox="0 0 300 350" className="drop-shadow-lg">
      {/* Ground */}
      <line x1="30" y1="280" x2="270" y2="280" stroke="#C8B6A6" strokeWidth="3" />
      <ellipse cx="150" cy="290" rx="80" ry="40" fill="#D4A574" opacity="0.6" />

      {/* All 10 roots - still visible */}
      <g opacity="0.25">
        {rootPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            stroke="#7A6F5D"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* Trunk */}
      <motion.path
        d="M 145 280 Q 144 240 145 200 Q 144 160 146 120 Q 147 80 148 60"
        stroke="#8B6F47"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Branches with individual leaves alternating left/right */}
      {branches.map((branch, branchIdx) =>
        branch.active && (
          <g key={branchIdx}>
            {/* Branch path */}
            <motion.path
              d={branch.path}
              stroke="#8B6F47"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + branchIdx * 0.1 }}
            />

            {/* Individual leaves along the branch alternating sides */}
            {Array.from({ length: branch.leafCount }).map((_, leafIdx) => {
              const progress = (leafIdx + 1) / 10; // 0.1 to 1.0
              const baseX = branch.startX + (branch.endX - branch.startX) * progress;
              const baseY = branch.startY + (branch.endY - branch.startY) * progress;

              // Alternate leaves slightly above/below branch line
              const isTopSide = leafIdx % 2 === 0;
              const offset = isTopSide ? -3 : 3;
              const y = baseY + offset;

              const rotation = branchIdx % 2 === 0 ? -30 : 30;

              return (
                <motion.g
                  key={leafIdx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + branchIdx * 0.1 + leafIdx * 0.05 }}
                >
                  {/* Leaf with dark border */}
                  <ellipse
                    cx={baseX}
                    cy={y}
                    rx="6"
                    ry="10"
                    fill="#6B8E65"
                    stroke="#2D4A28"
                    strokeWidth="1"
                    transform={`rotate(${rotation} ${baseX} ${y})`}
                  />
                  <ellipse
                    cx={baseX}
                    cy={y}
                    rx="5"
                    ry="9"
                    fill="#A8C69F"
                    transform={`rotate(${rotation} ${baseX} ${y})`}
                  />
                </motion.g>
              );
            })}
          </g>
        )
      )}
    </svg>
  );
}

// Stage 4: Adult tree with unlimited progressive growth (70+ logs)
function AdultTreeStage({ logCount }: { logCount: number }) {
  const extraGrowth = Math.min((logCount - 70) / 10, 5); // Progressively denser

  return (
    <svg width="340" height="370" viewBox="0 0 340 370" className="drop-shadow-2xl">
      {/* Ground with grass texture */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <line x1="10" y1="310" x2="330" y2="310" stroke="#C8B6A6" strokeWidth="3" />
        <ellipse cx="170" cy="320" rx="100" ry="50" fill="#D4A574" opacity="0.6" />
        {/* Grass blades */}
        {Array.from({ length: 15 }).map((_, i) => (
          <line
            key={i}
            x1={70 + i * 15}
            y1="310"
            x2={72 + i * 15}
            y2="300"
            stroke="#A8C69F"
            strokeWidth="2"
            opacity="0.5"
          />
        ))}
      </motion.g>

      {/* Trunk - strong and wide */}
      <motion.rect
        x="155"
        y="190"
        width="30"
        height="120"
        rx="8"
        fill="#8B6F47"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        style={{ transformOrigin: 'bottom' }}
        transition={{ duration: 0.6 }}
      />

      {/* Complex branch system */}
      <motion.g
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Main branches */}
        <path d="M 160 220 Q 115 190 80 165" stroke="#8B6F47" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M 180 220 Q 225 190 260 165" stroke="#8B6F47" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M 160 180 Q 125 155 100 135" stroke="#8B6F47" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M 180 180 Q 215 155 240 135" stroke="#8B6F47" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Upper branches */}
        <path d="M 165 150 Q 145 130 130 110" stroke="#8B6F47" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 175 150 Q 195 130 210 110" stroke="#8B6F47" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 168 120 Q 160 100 155 80" stroke="#8B6F47" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 172 120 Q 180 100 185 80" stroke="#8B6F47" strokeWidth="6" fill="none" strokeLinecap="round" />
      </motion.g>

      {/* Lush foliage - grows denser with more logs */}
      {[
        { cx: 80, cy: 165, r: 40 },
        { cx: 260, cy: 165, r: 40 },
        { cx: 100, cy: 135, r: 38 },
        { cx: 240, cy: 135, r: 38 },
        { cx: 130, cy: 110, r: 35 },
        { cx: 210, cy: 110, r: 35 },
        { cx: 155, cy: 80, r: 32 },
        { cx: 185, cy: 80, r: 32 },
        { cx: 170, cy: 60, r: 38 },
        // Additional density based on extra growth
        { cx: 60, cy: 185, r: 30 + extraGrowth * 2 },
        { cx: 280, cy: 185, r: 30 + extraGrowth * 2 },
        { cx: 120, cy: 145, r: 28 + extraGrowth * 2 },
        { cx: 220, cy: 145, r: 28 + extraGrowth * 2 },
        { cx: 150, cy: 100, r: 26 + extraGrowth * 2 },
        { cx: 190, cy: 100, r: 26 + extraGrowth * 2 },
      ].map((cluster, i) => (
        <motion.circle
          key={i}
          cx={cluster.cx}
          cy={cluster.cy}
          r={cluster.r}
          fill="#7A9B76"
          opacity="0.95"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 + i * 0.04 }}
        />
      ))}

      {/* Flowers - pink blossoms */}
      {[
        { cx: 90, cy: 160, r: 6 },
        { cx: 250, cy: 170, r: 6 },
        { cx: 110, cy: 130, r: 6 },
        { cx: 230, cy: 140, r: 6 },
        { cx: 140, cy: 105, r: 6 },
        { cx: 200, cy: 115, r: 6 },
        { cx: 165, cy: 75, r: 6 },
        { cx: 180, cy: 85, r: 6 },
      ].map((flower, i) => (
        <motion.g
          key={`flower-${i}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }}
        >
          <circle cx={flower.cx} cy={flower.cy} r={flower.r} fill="#FFB6C1" />
          <circle cx={flower.cx} cy={flower.cy} r={flower.r * 0.5} fill="#FFE4E8" />
        </motion.g>
      ))}

      {/* Fruits - red apples */}
      {[
        { cx: 75, cy: 180, r: 8 },
        { cx: 265, cy: 175, r: 8 },
        { cx: 105, cy: 145, r: 8 },
        { cx: 235, cy: 150, r: 8 },
        { cx: 135, cy: 120, r: 8 },
        { cx: 205, cy: 125, r: 8 },
      ].map((fruit, i) => (
        <motion.g
          key={`fruit-${i}`}
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.5 + i * 0.1,
            type: 'spring',
            bounce: 0.4
          }}
        >
          <circle cx={fruit.cx} cy={fruit.cy} r={fruit.r} fill="#D4574D" />
          <ellipse
            cx={fruit.cx - 2}
            cy={fruit.cy - 2}
            rx={fruit.r * 0.4}
            ry={fruit.r * 0.3}
            fill="#E87069"
            opacity="0.7"
          />
          {/* Stem */}
          <line
            x1={fruit.cx}
            y1={fruit.cy - fruit.r}
            x2={fruit.cx}
            y2={fruit.cy - fruit.r - 3}
            stroke="#8B6F47"
            strokeWidth="1.5"
          />
        </motion.g>
      ))}
    </svg>
  );
}
