'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PositiveMoment, Person } from '@/lib/types';
import { useState } from 'react';

interface LogDetailModalProps {
  log: PositiveMoment | null;
  familyMembers: Person[];
  onClose: () => void;
  onToggleStar: (logId: string) => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export default function LogDetailModal({
  log,
  familyMembers,
  onClose,
  onToggleStar,
  onNavigate,
  hasNext = false,
  hasPrev = false,
}: LogDetailModalProps) {
  if (!log) return null;

  const participants = log.participantIds
    .map((id) => familyMembers.find((m) => m.id === id))
    .filter(Boolean) as Person[];

  const formattedDate = new Date(log.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const emotionEmojis = ['😢', '😕', '😐', '😊', '🤩'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sage/20 to-moss/20 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {log.activityName || 'Positive Moment'}
              </h2>
              <button
                onClick={() => onToggleStar(log.id)}
                className="p-2 rounded-full hover:bg-white/50 transition-colors"
              >
                {log.starred ? (
                  <svg className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-400 hover:text-yellow-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Date */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</p>
              <p className="text-lg text-gray-900">{formattedDate}</p>
            </div>

            {/* Participants */}
            {participants.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Participants
                </p>
                <div className="flex flex-wrap gap-2">
                  {participants.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-2 bg-sage/10 px-3 py-1.5 rounded-full"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: person.avatarColor }}
                      >
                        {person.initials}
                      </div>
                      <span className="text-gray-700 font-medium">{person.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional People */}
            {log.additionalPeople && (
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Also With
                </p>
                <p className="text-gray-700">{log.additionalPeople}</p>
              </div>
            )}

            {/* Emotion Rating */}
            {log.emotionRating !== undefined && (
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Emotion
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{emotionEmojis[log.emotionRating - 1]}</span>
                  <span className="text-gray-600">
                    {['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'][log.emotionRating - 1]}
                  </span>
                </div>
              </div>
            )}

            {/* Notes */}
            {log.notes && (
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</p>
                <p className="text-gray-700 whitespace-pre-wrap">{log.notes}</p>
              </div>
            )}

            {/* Photos */}
            {log.photos.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Photos ({log.photos.length})
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {log.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-square rounded-xl overflow-hidden shadow-md"
                      style={{ backgroundColor: photo.color }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Points Earned */}
            <div className="bg-moss/10 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Points Earned
              </p>
              <p className="text-2xl font-bold text-moss">{log.pointsEarned} pts</p>
            </div>
          </div>

          {/* Navigation Footer */}
          {onNavigate && (hasPrev || hasNext) && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
              <button
                onClick={() => onNavigate('prev')}
                disabled={!hasPrev}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-sm text-gray-500">Navigate chronologically</span>
              <button
                onClick={() => onNavigate('next')}
                disabled={!hasNext}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-md"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
