import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import FamilyTreeSelector from '@/components/FamilyTreeSelector';

export const metadata: Metadata = {
  title: 'ROOTS - Family Bonding App',
  description: 'Grow your family tree of love',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-moss">🌳 ROOTS</h1>
            </div>
            <FamilyTreeSelector />
          </div>
        </header>

        {/* Main content area with padding for fixed header and nav */}
        <main className="pt-16 pb-20 min-h-screen">
          {children}
        </main>

        {/* Bottom navigation */}
        <Navigation />
      </body>
    </html>
  );
}
