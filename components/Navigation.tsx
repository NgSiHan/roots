'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Bottom navigation bar with 4 main tabs
 */
export default function Navigation() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Tree', path: '/tree', icon: '🌳' },
    { name: 'Family Tree', path: '/family-tree', icon: '👨‍👩‍👧‍👦' },
    { name: 'Activities', path: '/activities', icon: '✨' },
    { name: 'Memories', path: '/memories', icon: '📸' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-moss font-semibold scale-105'
                    : 'text-gray-500 hover:text-moss hover:scale-105'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-xs">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
