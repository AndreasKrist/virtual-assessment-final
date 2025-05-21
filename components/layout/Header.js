import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAssessment } from '../../contexts/AssessmentContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-sm transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 shadow-md py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <motion.div 
            className="flex items-center cursor-pointer" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="mr-3 flex items-center justify-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/images/itel-logo.png" 
                alt="ITEL Logo" 
                className="h-10 w-auto"
              />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              ITEL - PTSA
            </span>
          </motion.div>
        </Link>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <NavLink href="/" label="Home" />
            </li>
            <li>
              <NavLink href="/assessment" label="Start Assessment" />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

// NavLink component with animations
function NavLink({ href, label }) {
  const router = useRouter();
  const { nextStage } = useAssessment();
  const isActive = router.pathname === href;
  
  const handleClick = (e) => {
    if (href === '/assessment' && router.pathname !== '/assessment') {
      e.preventDefault();
      nextStage();
      router.push(href);
    }
  };
  
  return (
    <Link href={href}>
      <motion.div 
        className={`relative cursor-pointer py-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-blue-800 hover:text-blue-600'}`}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onClick={handleClick}
      >
        {label}
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-0 h-0.5 bg-blue-600 w-full"
            layoutId="navbar-indicator"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
}