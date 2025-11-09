'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface AccordionProps {
  children: ReactNode;
  defaultExpanded?: string | null;
  onExpandedChange?: (id: string | null) => void;
}

interface AccordionItemProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Accordion container - manages which item is expanded
 */
export function Accordion({ children, defaultExpanded = null, onExpandedChange }: AccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpanded);

  const handleToggle = (id: string) => {
    const newId = expandedId === id ? null : id;
    setExpandedId(newId);
    onExpandedChange?.(newId);
  };

  return (
    <div className="space-y-4">
      {Array.isArray(children) &&
        children.map((child: any) => {
          if (child.type === AccordionItem) {
            return {
              ...child,
              props: {
                ...child.props,
                isExpanded: expandedId === child.props.id,
                onToggle: () => handleToggle(child.props.id),
              },
            };
          }
          return child;
        })}
    </div>
  );
}

/**
 * Individual accordion item
 */
export function AccordionItem({
  id,
  title,
  subtitle,
  children,
  isExpanded,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl text-moss"
        >
          ▼
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
