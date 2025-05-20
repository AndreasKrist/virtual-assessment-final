import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  // Force light mode on initial load and ensure theme is properly applied
  useEffect(() => {
    // Force light mode on initial load if not already set
    const initialTheme = localStorage.getItem('theme') || 'light';
    setTheme(initialTheme);
    
    // Ensure proper class is immediately applied to avoid flash
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(initialTheme === 'dark' ? 'dark' : 'light');
  }, []);
  
  // Watch for theme changes
  useEffect(() => {
    if (!theme) return;
    
    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(currentTheme);
    
    // Force repaint for all Tailwind classes
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force a reflow
    document.body.style.display = '';
  }, [theme, resolvedTheme]); 

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}