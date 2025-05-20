import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
      <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {currentYear} IT Career Assessment. All rights reserved.
      </div>
    </footer>
  );
}