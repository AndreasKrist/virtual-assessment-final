import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can show the toggle
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply the theme classes directly to ensure immediate visual update
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    
    // Then update the theme context
    setTheme(newTheme);
    
    // Save to localStorage for persistence
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) {
    return (
      <button
        aria-label="Toggle dark mode"
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      aria-label={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors"
      onClick={toggleTheme}
    >
      {currentTheme === 'dark' ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-blue-500" />
      )}
    </button>
  );
}