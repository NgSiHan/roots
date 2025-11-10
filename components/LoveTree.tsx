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

// Stage 4: Adult tree with unlimited growth (70+ logs)
// Displays logs 10+ on unlimited dynamic branches alternating left/right
// Tree grows taller and wider as more logs are added
// Roots always show logs 0-9
function AdultTreeStage({
  logCount,
  logs,
  onElementClick,
}: {
  logCount: number;
  logs: PositiveMoment[];
  onElementClick: (logId: string) => void;
}) {
  // Adult tree shows branches displaying logs 10+
  // (Logs 0-9 are shown as roots)
  // Growth pattern: branches grow from 10 to 20 leaves before creating new branches
  // - Logs 10-69: Create 6 branches with 10 leaves each
  // - Logs 70-129: Existing 6 branches grow to 20 leaves each
  // - Logs 130-189: Create 6 more branches (12 total) with 10 leaves each
  // - Logs 190-249: Those 6 branches grow to 20 leaves each
  // Pattern: Every 120 logs adds 6 branches (first pass 10 leaves, second pass +10 more)

  const logsForBranches = Math.max(0, logCount - 10); // Logs after the 10 roots

  // Calculate total branches
  // Each complete "set" of 120 logs creates 6 branches
  const completedSets = Math.floor(logsForBranches / 120);
  const remainderLogs = logsForBranches % 120;
  let totalBranches = completedSets * 6;

  if (remainderLogs > 60) {
    // Second pass of current set - 6 branches being filled to 20 leaves
    totalBranches += 6;
  } else {
    // First pass of current set - creating branches with 10 leaves each
    totalBranches += Math.ceil(remainderLogs / 10);
  }

  // Dynamic height based on number of branches
  const baseHeight = 420;
  const heightPerBranch = 40; // Each branch adds 40 units of height
  const svgHeight = Math.max(baseHeight, baseHeight + (totalBranches - 6) * heightPerBranch);
  const viewBoxHeight = svgHeight;

  // Dynamic width - tree grows wider as it gets taller
  const baseWidth = 340;
  const widthPerBranch = 30; // Each branch pair adds 30 units of width
  const svgWidth = Math.max(baseWidth, baseWidth + Math.floor(totalBranches / 2) * widthPerBranch);
  const viewBoxWidth = svgWidth;
  const centerX = viewBoxWidth / 2;

  // Keep all 10 roots from Seed stage - dynamically centered
  const rootPaths = [
    `M ${centerX} 310 L ${centerX} 340 L ${centerX - 10} 360 L ${centerX - 30} 380 L ${centerX - 50} 395`,
    `M ${centerX} 310 L ${centerX} 340 L ${centerX - 10} 360 L ${centerX - 20} 385 L ${centerX - 32} 400`,
    `M ${centerX} 310 L ${centerX} 340 L ${centerX - 5} 365 L ${centerX - 12} 385 L ${centerX - 20} 400`,
    `M ${centerX} 310 L ${centerX} 340 L ${centerX - 2} 365 L ${centerX - 8} 388 L ${centerX - 12} 405`,
    `M ${centerX} 310 L ${centerX} 340 L ${centerX} 370 L ${centerX - 5} 392 L ${centerX - 5} 410`,
    `M ${centerX} 310 L ${centerX} 340 L ${centerX + 2} 365 L ${centerX + 8} 388 L ${centerX + 12} 405`,
    `M ${centerX} 310 L ${centerX} 340 L ${centerX + 5} 365 L ${centerX + 12} 385 L ${centerX + 20} 400`,
    `M ${centerX} 310 L ${centerX} 340 L ${centerX + 10} 360 L ${centerX + 20} 385 L ${centerX + 32} 400`,
    `M ${centerX} 310 L ${centerX} 340 L ${centerX + 10} 360 L ${centerX + 30} 380 L ${centerX + 50} 395`,
    `M ${centerX} 310 L ${centerX} 340 L ${centerX} 370 L ${centerX + 5} 392 L ${centerX + 12} 410`,
  ];

  // Generate branch configurations dynamically - unlimited growth
  // Create more organic, realistic branches with curves and slight drooping
  const generateBranchConfig = (idx: number) => {
    const isLeft = idx % 2 === 0;
    // Branches start at y=180 and go up by 40 units for each pair
    const pairIndex = Math.floor(idx / 2);
    const trunkY = 180 - pairIndex * 40;

    // Branches grow wider as the tree gets taller
    const baseExtension = 105; // Base distance from trunk
    const widthGrowth = pairIndex * 15; // Each pair extends further out

    // Add some variation to make branches less uniform
    const angleVariation = (idx % 3) * 3 - 3; // -3, 0, or 3 degrees of variation
    const lengthVariation = (idx % 4) * 5; // 0, 5, 10, or 15 units variation

    if (isLeft) {
      // Left branch - organic curve pointing upward
      const startX = centerX - 15;
      const control1X = centerX - 35 - widthGrowth * 0.3;
      const control1Y = trunkY - 20 + angleVariation;
      const control2X = centerX - 65 - widthGrowth * 0.7;
      const control2Y = trunkY - 30 + angleVariation;
      const control3X = centerX - 85 - widthGrowth;
      const control3Y = trunkY - 28 + angleVariation; // Upward curve
      const endX = centerX - baseExtension - widthGrowth - lengthVariation;
      const endY = trunkY - 25 + angleVariation; // Points upward

      return {
        path: `M ${startX} ${trunkY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${control3X} ${control3Y} S ${endX + 10} ${endY - 2}, ${endX} ${endY}`,
        startX: startX,  // Start from trunk connection
        startY: trunkY,  // Start from trunk connection
        endX: endX,
        endY: endY,
      };
    } else {
      // Right branch - organic curve pointing upward
      const startX = centerX + 15;
      const control1X = centerX + 35 + widthGrowth * 0.3;
      const control1Y = trunkY - 20 + angleVariation;
      const control2X = centerX + 65 + widthGrowth * 0.7;
      const control2Y = trunkY - 30 + angleVariation;
      const control3X = centerX + 85 + widthGrowth;
      const control3Y = trunkY - 28 + angleVariation; // Upward curve
      const endX = centerX + baseExtension + widthGrowth + lengthVariation;
      const endY = trunkY - 25 + angleVariation; // Points upward

      return {
        path: `M ${startX} ${trunkY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${control3X} ${control3Y} S ${endX - 10} ${endY - 3}, ${endX} ${endY}`,
        startX: startX,  // Start from trunk connection
        startY: trunkY,  // Start from trunk connection
        endX: endX,
        endY: endY,
      };
    }
  };

  const branches = Array.from({ length: totalBranches }).map((_, idx) => {
    const config = generateBranchConfig(idx);

    // Determine which set and position within set
    const setIndex = Math.floor(idx / 6);
    const branchInSet = idx % 6;

    // Calculate log ranges for this branch
    // First pass: 10 leaves at [setStart + branchOffset, setStart + branchOffset + 10)
    // Second pass: 10 more leaves at [setStart + 60 + branchOffset, setStart + 60 + branchOffset + 10)
    const setStart = 10 + setIndex * 120;
    const branchOffset = branchInSet * 10;
    const firstPassStart = setStart + branchOffset;
    const secondPassStart = setStart + 60 + branchOffset;

    // Collect logs for this branch
    const branchLogs: PositiveMoment[] = [];

    // Add first pass logs (first 10 leaves)
    for (let i = firstPassStart; i < firstPassStart + 10 && i < logCount; i++) {
      if (logs[i]) branchLogs.push(logs[i]);
    }

    // Add second pass logs (next 10 leaves) if we've reached that point
    if (logCount > secondPassStart) {
      for (let i = secondPassStart; i < secondPassStart + 10 && i < logCount; i++) {
        if (logs[i]) branchLogs.push(logs[i]);
      }
    }

    const leafCount = branchLogs.length;
    const branchCapacity = 20; // All branches can hold up to 20 leaves

    // Scatter fruit across both left and right branches
    // Pattern: skip every 3rd branch (idx % 3 !== 0)
    const shouldHaveFruit = idx % 3 !== 0;
    const hasFruit = shouldHaveFruit && leafCount >= branchCapacity;

    // If fruit, last log becomes fruit, rest are leaves
    const actualLeafCount = hasFruit ? leafCount - 1 : leafCount;
    const fruitLog = hasFruit ? branchLogs[branchLogs.length - 1] : undefined;

    return {
      ...config,
      leafCount: actualLeafCount,
      active: leafCount > 0,
      hasFruit,
      fruitLog,
      branchCapacity,
      branchLogs, // Store all logs for this branch
    };
  });

  // Calculate trunk end position based on highest branch
  const highestBranchY = totalBranches > 0 ? 180 - Math.floor((totalBranches - 1) / 2) * 40 - 40 : 40;
  const trunkEndY = Math.max(10, highestBranchY);

  // Adjust viewBox to properly frame the tree
  // Add padding above the highest branch and below the roots
  const topPadding = 30;
  const bottomPadding = 20;
  const minY = Math.min(trunkEndY - topPadding, 0);
  const maxY = 410 + bottomPadding; // Ground is at 310, roots extend to ~410
  const adjustedViewBoxHeight = maxY - minY;

  return (
    <svg width={svgWidth} height={svgHeight} viewBox={`0 ${minY} ${viewBoxWidth} ${adjustedViewBoxHeight}`} className="drop-shadow-2xl">
      {/* Ground with grass texture */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <line x1="10" y1="310" x2={viewBoxWidth - 10} y2="310" stroke="#C8B6A6" strokeWidth="3" />
        <ellipse cx={centerX} cy="320" rx="100" ry="50" fill="#D4A574" opacity="0.6" />
        {/* Grass blades */}
        {Array.from({ length: 15 }).map((_, i) => {
          const grassX = (viewBoxWidth - 200) / 2 + 70 + i * 15;
          return (
            <line
              key={i}
              x1={grassX}
              y1="310"
              x2={grassX + 2}
              y2="300"
              stroke="#A8C69F"
              strokeWidth="2"
              opacity="0.5"
            />
          );
        })}
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

      {/* Trunk - thicker for adult tree, extends dynamically based on branches */}
      <motion.path
        d={`M ${centerX - 5} 310 Q ${centerX - 6} 260 ${centerX - 5} 210 Q ${centerX - 6} 160 ${centerX - 4} 110 Q ${centerX - 3} ${(110 + trunkEndY) / 2} ${centerX - 2} ${trunkEndY}`}
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
            {branch.branchLogs.slice(0, branch.leafCount).map((log, leafIdx) => {
              const isStarred = log?.starred;

              // Distribute leaves evenly along branch using approximation
              // Use more control points for smoother curve following
              const progress = branch.leafCount > 1 ? leafIdx / (branch.leafCount - 1) : 0.5;

              // Calculate position along the curved branch path
              // Interpolate from trunk through the curve to the tip
              const trunkX = branch.startX;
              const trunkY = branch.startY;
              const isLeft = branchIdx % 2 === 0;

              // Approximate the curve with three segments for better accuracy
              let baseX, baseY;
              if (progress < 0.33) {
                // First third: trunk to first control point area
                const t = progress / 0.33;
                const midX = isLeft ? trunkX - 20 : trunkX + 20;
                const midY = trunkY - 10;
                baseX = trunkX + (midX - trunkX) * t;
                baseY = trunkY + (midY - trunkY) * t;
              } else if (progress < 0.67) {
                // Middle third: curve area
                const t = (progress - 0.33) / 0.34;
                const startMidX = isLeft ? trunkX - 20 : trunkX + 20;
                const startMidY = trunkY - 10;
                const endMidX = isLeft ? branch.endX + 40 : branch.endX - 40;
                const endMidY = branch.endY;
                baseX = startMidX + (endMidX - startMidX) * t;
                baseY = startMidY + (endMidY - startMidY) * t;
              } else {
                // Final third: approaching tip
                const t = (progress - 0.67) / 0.33;
                const startX = isLeft ? branch.endX + 40 : branch.endX - 40;
                baseX = startX + (branch.endX - startX) * t;
                baseY = branch.endY + (branch.endY - branch.endY) * t;
              }

              // Alternate leaves above/below branch line
              const isTopSide = leafIdx % 2 === 0;
              const offset = isTopSide ? -6 : 6;
              const y = baseY + offset;

              // Consistent rotation for orderly appearance
              const rotation = isTopSide ? -35 : 35;

              return (
                <motion.g
                  key={log.id}
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

