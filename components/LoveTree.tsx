'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Cartoonish "Tree of Love" that grows based on score (0-100)
 * Visual stages:
 * - 0-20: Small sapling, few leaves
 * - 21-60: Medium tree, more leaves, 1-2 blossoms
 * - 61-100: Full vibrant tree, many leaves, blossoms, hearts
 */
export default function LoveTree({ score }: { score: number }) {
  // Determine tree stage based on score
  const stage = useMemo(() => {
    if (score <= 20) return 'sapling';
    if (score <= 60) return 'growing';
    return 'full';
  }, [score]);

  // Scale based on score
  const scale = useMemo(() => {
    return 0.5 + (score / 100) * 0.5; // Scale from 0.5 to 1.0
  }, [score]);

  // Number of leaves based on stage
  const leafCount = useMemo(() => {
    if (stage === 'sapling') return 3;
    if (stage === 'growing') return 8;
    return 15;
  }, [stage]);

  // Generate leaf positions (random but consistent)
  const leaves = useMemo(() => {
    const positions = [];
    for (let i = 0; i < leafCount; i++) {
      // Circular-ish distribution around top
      const angle = (i / leafCount) * Math.PI * 2;
      const radius = 60 + Math.random() * 40;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius - 20;
      positions.push({ x, y, rotation: Math.random() * 360 });
    }
    return positions;
  }, [leafCount]);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <motion.div
        animate={{ scale }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative"
      >
        {/* Trunk */}
        <div className="relative z-10">
          <svg width="200" height="300" viewBox="0 0 200 300" className="drop-shadow-lg">
            {/* Main trunk */}
            <path
              d="M 90 250 Q 85 200 90 150 Q 88 100 95 50 Q 100 20 105 50 Q 110 100 108 150 Q 115 200 110 250 Z"
              fill="#8B6F47"
              stroke="#6B5437"
              strokeWidth="2"
            />
            {/* Branch left */}
            {stage !== 'sapling' && (
              <path
                d="M 90 120 Q 70 110 50 115"
                fill="none"
                stroke="#8B6F47"
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}
            {/* Branch right */}
            {stage !== 'sapling' && (
              <path
                d="M 110 120 Q 130 110 150 115"
                fill="none"
                stroke="#8B6F47"
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}
            {/* Branch left lower */}
            {stage === 'full' && (
              <path
                d="M 92 160 Q 75 155 60 160"
                fill="none"
                stroke="#8B6F47"
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}
            {/* Branch right lower */}
            {stage === 'full' && (
              <path
                d="M 108 160 Q 125 155 140 160"
                fill="none"
                stroke="#8B6F47"
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </div>

        {/* Canopy - leaves as blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          {leaves.map((leaf, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: i * 0.05,
                duration: 0.4,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: `${leaf.x}px`,
                top: `${leaf.y}px`,
                transform: `rotate(${leaf.rotation}deg)`,
              }}
              className="w-10 h-10 rounded-full bg-sage shadow-md"
            />
          ))}
        </div>

        {/* Blossoms (pink circles) */}
        {stage !== 'sapling' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="absolute top-8 left-12 w-6 h-6 rounded-full bg-pink-300 shadow-md"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="absolute top-16 right-16 w-6 h-6 rounded-full bg-pink-300 shadow-md"
            />
          </>
        )}

        {/* Hearts for full stage */}
        {stage === 'full' && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute top-12 left-20 text-2xl"
            >
              💖
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="absolute top-20 right-12 text-2xl"
            >
              💖
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="absolute top-32 left-16 text-xl"
            >
              ✨
            </motion.div>
          </>
        )}

        {/* Ground/grass */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-moss rounded-full opacity-30" />
      </motion.div>
    </div>
  );
}
