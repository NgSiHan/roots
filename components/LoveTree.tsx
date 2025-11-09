'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Tree of Love - Five distinct growth stages (0-100)
 * Stage 1 (0-20): Seed in soil
 * Stage 2 (21-40): Small sprout with few leaves
 * Stage 3 (41-60): Young tree with branches
 * Stage 4 (61-80): Mature tree with dense foliage
 * Stage 5 (81-100): Flourishing tree with flowers and fruits
 */

interface LoveTreeProps {
  score: number;
}

export default function LoveTree({ score }: LoveTreeProps) {
  // Determine stage based on score
  const stage = useMemo(() => {
    if (score <= 20) return 1;
    if (score <= 40) return 2;
    if (score <= 60) return 3;
    if (score <= 80) return 4;
    return 5;
  }, [score]);

  const stageName = useMemo(() => {
    const names = ['Seed', 'Sprout', 'Young Tree', 'Mature Tree', 'Flourishing Tree'];
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
          {stage === 1 && <SeedStage />}
          {stage === 2 && <SproutStage />}
          {stage === 3 && <YoungTreeStage />}
          {stage === 4 && <MatureTreeStage />}
          {stage === 5 && <FlourishingTreeStage />}
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

// Stage 1: Seed in soil
function SeedStage() {
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

// Stage 2: Small sprout
function SproutStage() {
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

      {/* Leaves - small */}
      {[
        { x: 140, y: 180, rotation: -30 },
        { x: 160, y: 170, rotation: 30 },
        { x: 145, y: 150, rotation: -20 },
        { x: 155, y: 140, rotation: 20 },
      ].map((leaf, i) => (
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
      ))}
    </svg>
  );
}

// Stage 3: Young tree with branches
function YoungTreeStage() {
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

      {/* Branches */}
      <motion.g
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <path d="M 145 140 Q 120 120 100 110" stroke="#8B6F47" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 146 140 Q 170 120 190 110" stroke="#8B6F47" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 145 100 Q 125 85 110 75" stroke="#8B6F47" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 147 100 Q 165 85 180 75" stroke="#8B6F47" strokeWidth="4" fill="none" strokeLinecap="round" />
      </motion.g>

      {/* Leaf clusters */}
      {[
        { cx: 100, cy: 110, r: 25 },
        { cx: 190, cy: 110, r: 25 },
        { cx: 110, cy: 75, r: 20 },
        { cx: 180, cy: 75, r: 20 },
        { cx: 145, cy: 50, r: 30 },
      ].map((cluster, i) => (
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
      ))}
    </svg>
  );
}

// Stage 4: Mature tree with dense foliage
function MatureTreeStage() {
  return (
    <svg width="320" height="360" viewBox="0 0 320 360" className="drop-shadow-xl">
      {/* Ground */}
      <line x1="20" y1="300" x2="300" y2="300" stroke="#C8B6A6" strokeWidth="3" />
      <ellipse cx="160" cy="310" rx="90" ry="45" fill="#D4A574" opacity="0.6" />

      {/* Trunk - thicker */}
      <motion.rect
        x="150"
        y="180"
        width="20"
        height="120"
        rx="5"
        fill="#8B6F47"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        style={{ transformOrigin: 'bottom' }}
        transition={{ duration: 0.6 }}
      />

      {/* Main branches */}
      <motion.g
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <path d="M 155 200 Q 120 170 90 150" stroke="#8B6F47" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M 165 200 Q 200 170 230 150" stroke="#8B6F47" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M 155 160 Q 130 140 110 120" stroke="#8B6F47" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 165 160 Q 190 140 210 120" stroke="#8B6F47" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 158 130 Q 145 110 135 90" stroke="#8B6F47" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 162 130 Q 175 110 185 90" stroke="#8B6F47" strokeWidth="5" fill="none" strokeLinecap="round" />
      </motion.g>

      {/* Dense foliage clusters */}
      {[
        { cx: 90, cy: 150, r: 35 },
        { cx: 230, cy: 150, r: 35 },
        { cx: 110, cy: 120, r: 32 },
        { cx: 210, cy: 120, r: 32 },
        { cx: 135, cy: 90, r: 28 },
        { cx: 185, cy: 90, r: 28 },
        { cx: 160, cy: 70, r: 35 },
        // Additional clusters for density
        { cx: 70, cy: 170, r: 25 },
        { cx: 250, cy: 170, r: 25 },
        { cx: 130, cy: 110, r: 25 },
        { cx: 190, cy: 110, r: 25 },
      ].map((cluster, i) => (
        <motion.circle
          key={i}
          cx={cluster.cx}
          cy={cluster.cy}
          r={cluster.r}
          fill="#7A9B76"
          opacity="0.9"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }}
        />
      ))}
    </svg>
  );
}

// Stage 5: Flourishing tree with flowers and fruits
function FlourishingTreeStage() {
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

      {/* Lush foliage */}
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
        // Additional dense layers
        { cx: 60, cy: 185, r: 30 },
        { cx: 280, cy: 185, r: 30 },
        { cx: 120, cy: 145, r: 28 },
        { cx: 220, cy: 145, r: 28 },
        { cx: 150, cy: 100, r: 26 },
        { cx: 190, cy: 100, r: 26 },
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
