import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

export default function Layout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle route change loading states
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/80 backdrop-blur-sm">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-600 loading-dot"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600 loading-dot"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600 loading-dot"></div>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={router.pathname}
          className="flex-grow"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}