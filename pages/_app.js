import { ThemeProvider } from 'next-themes';
import { AssessmentProvider } from '../contexts/AssessmentContext';
import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // Apply initial theme class to prevent flash of incorrect theme
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Get stored theme or default to light
      const savedTheme = localStorage.getItem('theme') || 'light';
      
      // Apply the theme class to html element
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme={typeof window !== 'undefined' ? undefined : 'light'}>
      <AssessmentProvider>
        <Component {...pageProps} />
      </AssessmentProvider>
    </ThemeProvider>
  );
}

export default MyApp;