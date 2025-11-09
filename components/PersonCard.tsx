'use client';

import { Person } from '@/lib/types';
import { motion } from 'framer-motion';

/**
 * Person card for family tree display
 */
export default function PersonCard({ person }: { person: Person }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2 border-gray-100 min-w-[140px]"
      style={{ borderTopColor: person.avatarColor }}
      onClick={() => console.log('Person clicked:', person.name)}
    >
      {/* Avatar circle */}
      <div
        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg shadow-md"
        style={{ backgroundColor: person.avatarColor }}
      >
        {person.initials}
      </div>

      {/* Name */}
      <h3 className="text-center font-semibold text-gray-800 text-sm mb-1">{person.name}</h3>

      {/* Role badge */}
      <div className="text-center">
        <span className="inline-block px-2 py-1 bg-sage/20 text-moss text-xs rounded-full font-medium">
          {person.role}
        </span>
      </div>

      {/* Birth year */}
      {person.birthYear && (
        <p className="text-center text-xs text-gray-500 mt-2">b. {person.birthYear}</p>
      )}
    </motion.div>
  );
}
