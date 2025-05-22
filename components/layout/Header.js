import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '../../contexts/AssessmentContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { stage, resetAssessment } = useAssessment();
  const router = useRouter();
  
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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  // Handle start over
  const handleStartOver = () => {
    resetAssessment();
    router.push('/');
    setMobileMenuOpen(false);
  };

  // Check if we should show the start over button
  const showStartOver = router.pathname === '/assessment' && stage !== 'welcome';

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-sm transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 shadow-md py-2 sm:py-3' 
        : 'bg-transparent py-3 sm:py-5'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <motion.div 
            className="flex items-center cursor-pointer" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="mr-2 sm:mr-3 flex items-center justify-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image 
                src="/images/itel-logo.png" 
                alt="ITEL Logo" 
                width={32} 
                height={32}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
            </motion.div>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              ITEL - PTSA
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li>
              <NavLink href="/" label="Home" />
            </li>
            <li>
              <NavLink href="/assessment" label="Start Assessment" />
            </li>
            {showStartOver && (
              <li>
                <motion.button
                  onClick={handleStartOver}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 Start Over
                </motion.button>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <motion.div
            animate={mobileMenuOpen ? "open" : "closed"}
            className="w-6 h-6 flex flex-col justify-center items-center"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 6 }
              }}
              className="w-6 h-0.5 bg-blue-600 block transition-all origin-center"
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
              }}
              className="w-6 h-0.5 bg-blue-600 block mt-1.5 transition-all"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -6 }
              }}
              className="w-6 h-0.5 bg-blue-600 block mt-1.5 transition-all origin-center"
            />
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-blue-100 shadow-lg"
          >
            <nav className="px-4 py-4">
              <ul className="space-y-4">
                <li>
                  <MobileNavLink href="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
                </li>
                <li>
                  <MobileNavLink 
                    href="/assessment" 
                    label="Start Assessment" 
                    onClick={() => setMobileMenuOpen(false)} 
                  />
                </li>
                {showStartOver && (
                  <li>
                    <button
                      onClick={handleStartOver}
                      className="w-full text-left px-4 py-3 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg font-medium transition-colors"
                    >
                      🔄 Start Over
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Desktop NavLink component
function NavLink({ href, label }) {
  const router = useRouter();
  const { startAssessment } = useAssessment();
  const isActive = router.pathname === href;
  
  const handleClick = (e) => {
    if (href === '/assessment' && router.pathname !== '/assessment') {
      e.preventDefault();
      startAssessment();
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

// Mobile NavLink component
function MobileNavLink({ href, label, onClick }) {
  const router = useRouter();
  const { startAssessment } = useAssessment();
  const isActive = router.pathname === href;
  
  const handleClick = (e) => {
    if (href === '/assessment' && router.pathname !== '/assessment') {
      e.preventDefault();
      startAssessment();
      router.push(href);
    }
    onClick();
  };
  
  return (
    <Link href={href}>
      <div 
        className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
          isActive 
            ? 'text-blue-600 bg-blue-50 border border-blue-200' 
            : 'text-blue-800 hover:text-blue-600 hover:bg-blue-50'
        }`}
        onClick={handleClick}
      >
        {label}
      </div>
    </Link>
  );
}