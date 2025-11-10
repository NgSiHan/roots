'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Tree of Love - Log-based growth stages
 * Stage 1 (0-9 logs): Seed with roots
 * Stage 2 (10-19 logs): Seedling with stem + leaves
 * Stage 3 (20-69 logs): Sprout with branches and leaves
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
    if (logCount < 20) return 2; // Seedling
    if (logCount < 70) return 3; // Sprout
    return 4; // Adult Tree
  }, [logCount]);

  const stageName = useMemo(() => {
    const names = ['Seed', 'Seedling', 'Sprout', 'Adult Tree'];
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
          {stage === 2 && <SeedlingStage logCount={logCount} />}
          {stage === 3 && <SproutStage logCount={logCount} />}
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

// Stage 1: Seed with growing roots (0-9 logs)
function SeedStage({ logCount }: { logCount: number }) {
  const rootCount = Math.min(logCount, 10);

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

      {/* Growing roots underground - binary tree structure */}
      <g opacity="0.6">
        {rootCount >= 1 && (
          <motion.path
            d="M 150 200 L 150 230"
            stroke="#7A6F5D"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        )}
        {rootCount >= 2 && (
          <motion.path
            d="M 150 230 Q 140 240 130 250"
            stroke="#7A6F5D"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          />
        )}
        {rootCount >= 3 && (
          <motion.path
            d="M 150 230 Q 160 240 170 250"
            stroke="#7A6F5D"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          />
        )}
        {rootCount >= 4 && (
          <motion.path
            d="M 130 250 Q 120 260 110 270"
            stroke="#7A6F5D"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          />
        )}
        {rootCount >= 5 && (
          <motion.path
            d="M 130 250 Q 135 260 140 270"
            stroke="#7A6F5D"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.0 }}
          />
        )}
        {rootCount >= 6 && (
          <motion.path
            d="M 170 250 Q 165 260 160 270"
            stroke="#7A6F5D"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.1 }}
          />
        )}
        {rootCount >= 7 && (
          <motion.path
            d="M 170 250 Q 180 260 190 270"
            stroke="#7A6F5D"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.2 }}
          />
        )}
        {rootCount >= 8 && (
          <motion.path
            d="M 110 270 Q 105 280 100 290"
            stroke="#7A6F5D"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.3 }}
          />
        )}
        {rootCount >= 9 && (
          <motion.path
            d="M 140 270 Q 145 280 150 290"
            stroke="#7A6F5D"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.4 }}
          />
        )}
        {rootCount >= 10 && (
          <motion.path
            d="M 190 270 Q 195 280 200 290"
            stroke="#7A6F5D"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.5 }}
          />
        )}
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

// Stage 2: Seedling with stem + 10 leaves (10-19 logs)
function SeedlingStage({ logCount }: { logCount: number }) {
  const leafCount = Math.min(logCount - 10, 10);

  return (
    <svg width="300" height="350" viewBox="0 0 300 350" className="drop-shadow-lg">
      {/* Ground */}
      <line x1="50" y1="250" x2="250" y2="250" stroke="#C8B6A6" strokeWidth="3" />
      <ellipse cx="150" cy="260" rx="70" ry="35" fill="#D4A574" opacity="0.6" />

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

      {/* Leaves growing progressively (10 total) */}
      {[
        { x: 140, y: 180, rotation: -30 },
        { x: 160, y: 170, rotation: 30 },
        { x: 145, y: 150, rotation: -20 },
        { x: 155, y: 140, rotation: 20 },
        { x: 142, y: 220, rotation: -35 },
        { x: 158, y: 210, rotation: 35 },
        { x: 143, y: 200, rotation: -25 },
        { x: 157, y: 190, rotation: 25 },
        { x: 147, y: 160, rotation: -15 },
        { x: 153, y: 155, rotation: 15 },
      ].map((leaf, i) => (
        i < leafCount && (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <ellipse
              cx={leaf.x}
              cy={leaf.y}
              rx="12"
              ry="20"
              fill="#A8C69F"
              transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
            />
          </motion.g>
        )
      ))}
    </svg>
  );
}

// Stage 3: Sprout with 5 branches × 10 leaves each (20-69 logs)
function SproutStage({ logCount }: { logCount: number }) {
  const totalLeaves = Math.min(logCount - 20, 50);
  const branchCount = Math.min(Math.floor(totalLeaves / 10) + 1, 5);

  return (
    <svg width="300" height="350" viewBox="0 0 300 350" className="drop-shadow-lg">
      {/* Ground */}
      <line x1="30" y1="280" x2="270" y2="280" stroke="#C8B6A6" strokeWidth="3" />
      <ellipse cx="150" cy="290" rx="80" ry="40" fill="#D4A574" opacity="0.6" />

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

      {/* 5 Branches growing progressively */}
      <motion.g
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {branchCount >= 1 && (
          <path d="M 145 140 Q 120 120 100 110" stroke="#8B6F47" strokeWidth="5" fill="none" strokeLinecap="round" />
        )}
        {branchCount >= 2 && (
          <path d="M 146 140 Q 170 120 190 110" stroke="#8B6F47" strokeWidth="5" fill="none" strokeLinecap="round" />
        )}
        {branchCount >= 3 && (
          <path d="M 145 100 Q 125 85 110 75" stroke="#8B6F47" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}
        {branchCount >= 4 && (
          <path d="M 147 100 Q 165 85 180 75" stroke="#8B6F47" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}
        {branchCount >= 5 && (
          <path d="M 146 70 Q 146 55 145 40" stroke="#8B6F47" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}
      </motion.g>

      {/* Leaf clusters for each branch (10 leaves per branch) */}
      {[
        { cx: 100, cy: 110, r: 25 },
        { cx: 190, cy: 110, r: 25 },
        { cx: 110, cy: 75, r: 20 },
        { cx: 180, cy: 75, r: 20 },
        { cx: 145, cy: 40, r: 30 },
      ].map((cluster, i) => (
        i < branchCount && (
          <motion.circle
            key={i}
            cx={cluster.cx}
            cy={cluster.cy}
            r={cluster.r}
            fill="#A8C69F"
            opacity="0.85"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
          />
        )
      ))}
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
