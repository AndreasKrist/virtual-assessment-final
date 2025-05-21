import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Header() {
  const router = useRouter();
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
              className="mr-3 bg-blue-600 text-white rounded-lg w-10 h-10 flex items-center justify-center"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: 1, repeatType: "reverse", delay: 1 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              ITEL - Virtual Assessor
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
            <li>
              <NavLink href="/admin" label="Admin" />
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
  const isActive = router.pathname === href;
  
  return (
    <Link href={href}>
      <motion.div 
        className={`relative cursor-pointer py-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-blue-800 hover:text-blue-600'}`}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
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