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

import { PositiveMoment } from '@/lib/types';

interface LoveTreeProps {
  score: number; // This is actually logCount now
  logs: PositiveMoment[]; // All logs for this tree, sorted chronologically
  onElementClick: (logId: string) => void; // Called when clicking a tree element
}

export default function LoveTree({ score, logs, onElementClick }: LoveTreeProps) {
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
          {stage === 1 && <SeedStage logCount={logCount} logs={logs} onElementClick={onElementClick} />}
          {stage === 2 && <SproutStage logCount={logCount} logs={logs} onElementClick={onElementClick} />}
          {stage === 3 && <YoungTreeStage logCount={logCount} logs={logs} onElementClick={onElementClick} />}
          {stage === 4 && <AdultTreeStage logCount={logCount} logs={logs} onElementClick={onElementClick} />}
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
function SeedStage({
  logCount,
  logs,
  onElementClick,
}: {
  logCount: number;
  logs: PositiveMoment[];
  onElementClick: (logId: string) => void;
}) {
  const rootCount = Math.min(logCount, 10);

  // 10 roots with branching pattern - each root has its own distinct endpoint
  // Structure: Base → main roots → branching roots → 10 distinct endpoints
  const rootPaths = [
    { path: "M 150 200 L 150 230 L 140 250 L 120 270 L 100 285", desc: "Root 1 - far left endpoint" },
    { path: "M 150 200 L 150 230 L 140 250 L 130 275 L 118 290", desc: "Root 2 - left endpoint from main branch" },
    { path: "M 150 200 L 150 230 L 145 255 L 138 275 L 130 290", desc: "Root 3 - center-left endpoint" },
    { path: "M 150 200 L 150 230 L 148 255 L 142 278 L 138 295", desc: "Root 4 - left-center endpoint" },
    { path: "M 150 200 L 150 230 L 150 260 L 145 282 L 145 300", desc: "Root 5 - center deep endpoint" },
    { path: "M 150 200 L 150 230 L 152 255 L 158 278 L 162 295", desc: "Root 6 - right-center endpoint" },
    { path: "M 150 200 L 150 230 L 155 255 L 162 275 L 170 290", desc: "Root 7 - center-right endpoint" },
    { path: "M 150 200 L 150 230 L 160 250 L 170 275 L 182 290", desc: "Root 8 - right endpoint from main branch" },
    { path: "M 150 200 L 150 230 L 160 250 L 180 270 L 200 285", desc: "Root 9 - far right endpoint" },
    { path: "M 150 200 L 150 230 L 150 260 L 155 282 L 162 300", desc: "Root 10 - right deep endpoint" },
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

      {/* 10 individual roots with branching pattern - each root is clickable */}
      <g opacity="0.6">
        {rootPaths.slice(0, rootCount).map((root, i) => {
          const log = logs[i]; // Each root represents one log chronologically
          const isStarred = log?.starred;

          return (
            <g key={i}>
              <motion.path
                d={root.path}
                stroke={isStarred ? "#FFD700" : "#7A6F5D"}
                strokeWidth={isStarred ? "3.5" : "2.5"}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                onClick={() => log && onElementClick(log.id)}
                style={{ cursor: log ? 'pointer' : 'default' }}
                className={log ? 'hover:opacity-80 transition-opacity' : ''}
              />
              {/* Glowing dot for starred logs */}
              {isStarred && log && (
                <motion.circle
                  cx={rootPaths[i].path.split(' ').slice(-2, -1)[0]}
                  cy={rootPaths[i].path.split(' ').slice(-1)[0]}
                  r="4"
                  fill="#FFD700"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={() => onElementClick(log.id)}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </g>
          );
        })}
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
function SproutStage({
  logCount,
  logs,
  onElementClick,
}: {
  logCount: number;
  logs: PositiveMoment[];
  onElementClick: (logId: string) => void;
}) {
  const leafCount = Math.min(logCount - 10, 10);

  // Keep all 10 roots from Seed stage - adjusted for Sprout ground level
  const rootPaths = [
    "M 150 250 L 150 280 L 140 300 L 120 320 L 100 335",
    "M 150 250 L 150 280 L 140 300 L 130 325 L 118 340",
    "M 150 250 L 150 280 L 145 305 L 138 325 L 130 340",
    "M 150 250 L 150 280 L 148 305 L 142 328 L 138 345",
    "M 150 250 L 150 280 L 150 310 L 145 332 L 145 350",
    "M 150 250 L 150 280 L 152 305 L 158 328 L 162 345",
    "M 150 250 L 150 280 L 155 305 L 162 325 L 170 340",
    "M 150 250 L 150 280 L 160 300 L 170 325 L 182 340",
    "M 150 250 L 150 280 L 160 300 L 180 320 L 200 335",
    "M 150 250 L 150 280 L 150 310 L 155 332 L 162 350",
  ];

  return (
    <svg width="300" height="350" viewBox="0 0 300 350" className="drop-shadow-lg">
      {/* Ground */}
      <line x1="50" y1="250" x2="250" y2="250" stroke="#C8B6A6" strokeWidth="3" />
      <ellipse cx="150" cy="260" rx="70" ry="35" fill="#D4A574" opacity="0.6" />

      {/* All 10 roots from Seed stage - still visible and clickable */}
      <g opacity="0.3">
        {rootPaths.map((path, i) => {
          const log = logs[i]; // Roots represent logs 0-9
          const isStarred = log?.starred;

          return (
            <g key={i}>
              <path
                d={path}
                stroke={isStarred ? "#FFD700" : "#7A6F5D"}
                strokeWidth={isStarred ? "3" : "2"}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => log && onElementClick(log.id)}
                style={{ cursor: log ? 'pointer' : 'default' }}
                className={log ? 'hover:opacity-80 transition-opacity' : ''}
              />
              {/* Glowing dot for starred logs */}
              {isStarred && log && (
                <motion.circle
                  cx={path.split(' ').slice(-2, -1)[0]}
                  cy={path.split(' ').slice(-1)[0]}
                  r="4"
                  fill="#FFD700"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={() => onElementClick(log.id)}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </g>
          );
        })}
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

      {/* Leaves alternating left/right with borders (10 total) - clickable */}
      {Array.from({ length: leafCount }).map((_, i) => {
        const stemY = 230 - i * 15; // Increased spacing to prevent overlap
        const isLeft = i % 2 === 0;
        const x = isLeft ? 138 : 162; // Wider spacing from stem
        const rotation = isLeft ? -35 : 35; // More rotation for better visibility

        const log = logs[10 + i]; // Leaves represent logs 10-19
        const isStarred = log?.starred;

        return (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            {/* Leaf shape with pointed tip and rounded base */}
            <g
              transform={`translate(${x}, ${stemY}) rotate(${rotation})`}
              onClick={() => log && onElementClick(log.id)}
              style={{ cursor: log ? 'pointer' : 'default' }}
              className={log ? 'hover:opacity-80 transition-opacity' : ''}
            >
              {/* Dark border leaf */}
              <path
                d="M 0,-9 Q 5,-6 6,0 Q 5,8 0,9 Q -5,8 -6,0 Q -5,-6 0,-9 Z"
                fill={isStarred ? "#FFE066" : "#6B8E65"}
                stroke={isStarred ? "#FFD700" : "#2D4A28"}
                strokeWidth={isStarred ? "2" : "1.5"}
              />
              {/* Inner lighter leaf */}
              <path
                d="M 0,-7.5 Q 4,-5 5,0 Q 4,6.5 0,7.5 Q -4,6.5 -5,0 Q -4,-5 0,-7.5 Z"
                fill={isStarred ? "#FFF4CC" : "#A8C69F"}
              />
              {/* Leaf vein */}
              <line x1="0" y1="-7" x2="0" y2="7" stroke="#6B8E65" strokeWidth="0.5" opacity="0.5" />
              {/* Star indicator for starred logs */}
              {isStarred && (
                <motion.circle
                  cx="0"
                  cy="0"
                  r="3"
                  fill="#FFD700"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </g>
          </motion.g>
        );
      })}
    </svg>
  );
}

// Stage 3: Young Tree with 6 branches × 10 individual leaves each (20-69 logs)
function YoungTreeStage({
  logCount,
  logs,
  onElementClick,
}: {
  logCount: number;
  logs: PositiveMoment[];
  onElementClick: (logId: string) => void;
}) {
  // First branch starts with 10 leaves (from Sprout transition)
  // Each additional log adds to subsequent branches
  const totalLeaves = Math.min(logCount - 20 + 10, 60); // +10 for Sprout transition

  // Keep all 10 roots from Seed stage - adjusted for Young Tree ground level
  const rootPaths = [
    "M 150 280 L 150 310 L 140 330 L 120 350 L 100 365",
    "M 150 280 L 150 310 L 140 330 L 130 355 L 118 370",
    "M 150 280 L 150 310 L 145 335 L 138 355 L 130 370",
    "M 150 280 L 150 310 L 148 335 L 142 358 L 138 375",
    "M 150 280 L 150 310 L 150 340 L 145 362 L 145 380",
    "M 150 280 L 150 310 L 152 335 L 158 358 L 162 375",
    "M 150 280 L 150 310 L 155 335 L 162 355 L 170 370",
    "M 150 280 L 150 310 L 160 330 L 170 355 L 182 370",
    "M 150 280 L 150 310 L 160 330 L 180 350 L 200 365",
    "M 150 280 L 150 310 L 150 340 L 155 362 L 162 380",
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
      path: "M 145 70 Q 130 60 115 55 L 95 45",
      startX: 115, startY: 55, endX: 95, endY: 45,
    },
    {
      active: totalLeaves > 50,
      leafCount: Math.min(Math.max(0, totalLeaves - 50), 10),
      path: "M 147 70 Q 160 60 175 55 L 195 45",
      startX: 175, startY: 55, endX: 195, endY: 45,
    },
  ];

  return (
    <svg width="300" height="350" viewBox="0 0 300 350" className="drop-shadow-lg">
      {/* Ground */}
      <line x1="30" y1="280" x2="270" y2="280" stroke="#C8B6A6" strokeWidth="3" />
      <ellipse cx="150" cy="290" rx="80" ry="40" fill="#D4A574" opacity="0.6" />

      {/* All 10 roots - still visible and clickable */}
      <g opacity="0.25">
        {rootPaths.map((path, i) => {
          const log = logs[i]; // Roots represent logs 0-9
          const isStarred = log?.starred;

          return (
            <g key={i}>
              <path
                d={path}
                stroke={isStarred ? "#FFD700" : "#7A6F5D"}
                strokeWidth={isStarred ? "3" : "2"}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => log && onElementClick(log.id)}
                style={{ cursor: log ? 'pointer' : 'default' }}
                className={log ? 'hover:opacity-80 transition-opacity' : ''}
              />
              {/* Glowing dot for starred logs */}
              {isStarred && log && (
                <motion.circle
                  cx={path.split(' ').slice(-2, -1)[0]}
                  cy={path.split(' ').slice(-1)[0]}
                  r="4"
                  fill="#FFD700"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={() => onElementClick(log.id)}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </g>
          );
        })}
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
      {branches.map((branch, branchIdx) => {
        // Calculate cumulative leaf index for this branch
        const branchStartLeafIdx = branchIdx * 10;

        return branch.active && (
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

            {/* Individual leaves along the branch alternating sides - no overlap */}
            {Array.from({ length: branch.leafCount }).map((_, leafIdx) => {
              // Calculate global leaf index
              const globalLeafIdx = branchStartLeafIdx + leafIdx;
              // Map to log: first 10 leaves (branch 0) map to logs 10-19, next 10 to logs 20-29, etc.
              const log = logs[10 + globalLeafIdx];
              const isStarred = log?.starred;

              // Distribute leaves with proper spacing along branch
              const progress = (leafIdx + 0.5) / 10; // 0.05 to 0.95 for better distribution
              const baseX = branch.startX + (branch.endX - branch.startX) * progress;
              const baseY = branch.startY + (branch.endY - branch.startY) * progress;

              // Alternate leaves above/below branch line with more offset
              const isTopSide = leafIdx % 2 === 0;
              const offset = isTopSide ? -6 : 6; // Increased offset to prevent overlap
              const y = baseY + offset;

              // Bottom leaves tilt 35 degrees away from top leaves
              const rotation = isTopSide ? -35 : 35;

              return (
                <motion.g
                  key={leafIdx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + branchIdx * 0.1 + leafIdx * 0.05 }}
                >
                  {/* Realistic leaf shape with pointed tip and rounded base */}
                  <g
                    transform={`translate(${baseX}, ${y}) rotate(${rotation})`}
                    onClick={() => log && onElementClick(log.id)}
                    style={{ cursor: log ? 'pointer' : 'default' }}
                    className={log ? 'hover:opacity-80 transition-opacity' : ''}
                  >
                    {/* Dark border leaf */}
                    <path
                      d="M 0,-4.5 Q 2.5,-3 3,0 Q 2.5,4 0,4.5 Q -2.5,4 -3,0 Q -2.5,-3 0,-4.5 Z"
                      fill={isStarred ? "#FFE066" : "#6B8E65"}
                      stroke={isStarred ? "#FFD700" : "#2D4A28"}
                      strokeWidth={isStarred ? "1.2" : "0.8"}
                    />
                    {/* Inner lighter leaf */}
                    <path
                      d="M 0,-3.5 Q 2,-2.5 2.5,0 Q 2,3.5 0,4 Q -2,3.5 -2.5,0 Q -2,-2.5 0,-3.5 Z"
                      fill={isStarred ? "#FFF4CC" : "#A8C69F"}
                    />
                    {/* Leaf vein */}
                    <line x1="0" y1="-3.5" x2="0" y2="4" stroke="#6B8E65" strokeWidth="0.3" opacity="0.5" />
                    {/* Star indicator for starred logs */}
                    {isStarred && (
                      <motion.circle
                        cx="0"
                        cy="0"
                        r="2"
                        fill="#FFD700"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </g>
                </motion.g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// Stage 4: Adult tree with branch+leaf+fruit logic (70+ logs)
// Displays logs 10-69 on 6 branches, with roots showing logs 0-9
function AdultTreeStage({
  logCount,
  logs,
  onElementClick,
}: {
  logCount: number;
  logs: PositiveMoment[];
  onElementClick: (logId: string) => void;
}) {
  // Adult tree shows 6 branches displaying logs 10-69
  // (Logs 0-9 are shown as roots, logs 70+ continue growing the tree)
  const totalBranches = 6;

  // Keep all 10 roots from Seed stage
  const rootPaths = [
    "M 170 310 L 170 340 L 160 360 L 140 380 L 120 395",
    "M 170 310 L 170 340 L 160 360 L 150 385 L 138 400",
    "M 170 310 L 170 340 L 165 365 L 158 385 L 150 400",
    "M 170 310 L 170 340 L 168 365 L 162 388 L 158 405",
    "M 170 310 L 170 340 L 170 370 L 165 392 L 165 410",
    "M 170 310 L 170 340 L 172 365 L 178 388 L 182 405",
    "M 170 310 L 170 340 L 175 365 L 182 385 L 190 400",
    "M 170 310 L 170 340 L 180 360 L 190 385 L 202 400",
    "M 170 310 L 170 340 L 180 360 L 200 380 L 220 395",
    "M 170 310 L 170 340 L 170 370 L 175 392 L 182 410",
  ];

  // Define 6 branches - alternating left, right pattern
  const branchConfigs = [
    { path: "M 165 180 Q 140 165 115 155 L 65 145", startX: 115, startY: 155, endX: 65, endY: 145 }, // Left 1
    { path: "M 175 180 Q 200 165 225 155 L 275 145", startX: 225, startY: 155, endX: 275, endY: 145 }, // Right 1
    { path: "M 165 140 Q 140 125 115 115 L 75 105", startX: 115, startY: 115, endX: 75, endY: 105 }, // Left 2
    { path: "M 175 140 Q 200 125 225 115 L 265 105", startX: 225, startY: 115, endX: 265, endY: 105 }, // Right 2
    { path: "M 165 100 Q 140 85 115 75 L 85 65", startX: 115, startY: 75, endX: 85, endY: 65 }, // Left 3
    { path: "M 175 100 Q 200 85 225 75 L 255 65", startX: 225, startY: 75, endX: 255, endY: 65 }, // Right 3
  ];

  const branches = branchConfigs.slice(0, totalBranches).map((config, idx) => {
    const logStartIdx = 10 + idx * 10; // Start from log 10 (after roots)
    const logsAvailableForBranch = Math.max(0, Math.min(logCount, 70) - logStartIdx);

    // Every even branch (0, 2, 4) has 10 leaves
    // Every odd branch (1, 3, 5) has 9 leaves + 1 fruit (if there are at least 10 logs)
    const isOddBranch = idx % 2 === 1;
    const branchLeafCount = isOddBranch
      ? Math.min(Math.max(0, logsAvailableForBranch - 1), 9) // Save last log for fruit
      : Math.min(logsAvailableForBranch, 10);

    const hasFruit = isOddBranch && logsAvailableForBranch >= 10;

    return {
      ...config,
      leafCount: branchLeafCount,
      active: branchLeafCount > 0 || hasFruit,
      hasFruit,
      fruitLog: hasFruit ? logs[logStartIdx + 9] : undefined, // 10th log becomes fruit
    };
  });

  return (
    <svg width="340" height="420" viewBox="0 0 340 420" className="drop-shadow-2xl">
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

      {/* All 10 roots - still visible and clickable */}
      <g opacity="0.2">
        {rootPaths.map((path, i) => {
          const log = logs[i]; // Roots represent logs 0-9
          const isStarred = log?.starred;

          return (
            <g key={i}>
              <path
                d={path}
                stroke={isStarred ? "#FFD700" : "#7A6F5D"}
                strokeWidth={isStarred ? "3" : "2"}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => log && onElementClick(log.id)}
                style={{ cursor: log ? 'pointer' : 'default' }}
                className={log ? 'hover:opacity-80 transition-opacity' : ''}
              />
              {/* Glowing dot for starred logs */}
              {isStarred && log && (
                <motion.circle
                  cx={path.split(' ').slice(-2, -1)[0]}
                  cy={path.split(' ').slice(-1)[0]}
                  r="4"
                  fill="#FFD700"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={() => onElementClick(log.id)}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </g>
          );
        })}
      </g>

      {/* Trunk - thicker for adult tree */}
      <motion.path
        d="M 165 310 Q 164 260 165 210 Q 164 160 166 110 Q 167 70 168 40"
        stroke="#8B6F47"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Branches with individual leaves - similar to Young Tree */}
      {branches.map((branch, branchIdx) => {
        const branchStartLogIdx = 10 + branchIdx * 10; // Start from log 10 (after roots)

        return branch.active && (
          <g key={branchIdx}>
            {/* Branch path */}
            <motion.path
              d={branch.path}
              stroke="#8B6F47"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + branchIdx * 0.1 }}
            />

            {/* Individual leaves along the branch */}
            {Array.from({ length: branch.leafCount }).map((_, leafIdx) => {
              const log = logs[branchStartLogIdx + leafIdx];
              const isStarred = log?.starred;

              // Distribute leaves with proper spacing along branch
              const progress = (leafIdx + 0.5) / 10;
              const baseX = branch.startX + (branch.endX - branch.startX) * progress;
              const baseY = branch.startY + (branch.endY - branch.startY) * progress;

              // Alternate leaves above/below branch line
              const isTopSide = leafIdx % 2 === 0;
              const offset = isTopSide ? -6 : 6;
              const y = baseY + offset;
              const rotation = isTopSide ? -35 : 35;

              return (
                <motion.g
                  key={leafIdx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + branchIdx * 0.1 + leafIdx * 0.05 }}
                >
                  <g
                    transform={`translate(${baseX}, ${y}) rotate(${rotation})`}
                    onClick={() => log && onElementClick(log.id)}
                    style={{ cursor: log ? 'pointer' : 'default' }}
                    className={log ? 'hover:opacity-80 transition-opacity' : ''}
                  >
                    {/* Dark border leaf */}
                    <path
                      d="M 0,-4.5 Q 2.5,-3 3,0 Q 2.5,4 0,4.5 Q -2.5,4 -3,0 Q -2.5,-3 0,-4.5 Z"
                      fill={isStarred ? "#FFE066" : "#6B8E65"}
                      stroke={isStarred ? "#FFD700" : "#2D4A28"}
                      strokeWidth={isStarred ? "1.2" : "0.8"}
                    />
                    {/* Inner lighter leaf */}
                    <path
                      d="M 0,-3.5 Q 2,-2.5 2.5,0 Q 2,3.5 0,4 Q -2,3.5 -2.5,0 Q -2,-2.5 0,-3.5 Z"
                      fill={isStarred ? "#FFF4CC" : "#A8C69F"}
                    />
                    {/* Leaf vein */}
                    <line x1="0" y1="-3.5" x2="0" y2="4" stroke="#6B8E65" strokeWidth="0.3" opacity="0.5" />
                    {/* Star indicator for starred logs */}
                    {isStarred && (
                      <motion.circle
                        cx="0"
                        cy="0"
                        r="2"
                        fill="#FFD700"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </g>
                </motion.g>
              );
            })}

            {/* Fruit at branch tip (last log of every 20 logs) */}
            {branch.hasFruit && branch.fruitLog && (() => {
              const fruitLog = branch.fruitLog;
              return (
                <motion.g
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.5 + branchIdx * 0.1,
                    type: 'spring',
                    bounce: 0.4
                  }}
                  onClick={() => onElementClick(fruitLog.id)}
                  style={{ cursor: 'pointer' }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <circle
                    cx={branch.endX}
                    cy={branch.endY}
                    r="8"
                    fill={fruitLog.starred ? "#FFD700" : "#D4574D"}
                  />
                  <ellipse
                    cx={branch.endX - 2}
                    cy={branch.endY - 2}
                    rx="3.2"
                    ry="2.4"
                    fill={fruitLog.starred ? "#FFF4CC" : "#E87069"}
                    opacity="0.7"
                  />
                  {/* Stem */}
                  <line
                    x1={branch.endX}
                    y1={branch.endY - 8}
                    x2={branch.endX}
                    y2={branch.endY - 11}
                    stroke="#8B6F47"
                    strokeWidth="1.5"
                  />
                  {/* Glowing indicator for starred logs */}
                  {fruitLog.starred && (
                    <motion.circle
                      cx={branch.endX}
                      cy={branch.endY}
                      r="12"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="2"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.3, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.g>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
}

