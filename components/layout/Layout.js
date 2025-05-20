import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  const { theme, resolvedTheme } = useTheme();
  
  // Ensure dark mode class is applied to the html element
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme, resolvedTheme]); 

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}