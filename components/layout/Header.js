import React from 'react';
import Link from 'next/link';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          IT Career Assessment
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}