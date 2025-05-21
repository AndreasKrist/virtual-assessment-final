import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 relative mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <motion.div 
                className="flex items-center mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mr-3 flex items-center justify-center">
                  <img src="/images/itel-logo.png" alt="ITEL Logo" className="h-8 w-auto" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Prelim Tech Skills Assessor
                </span>
              </motion.div>
              <p className="text-blue-700 text-sm">
                Find your ideal IT career path and get personalized learning recommendations.
              </p>
            </div>
            
            <div>
              <h4 className="text-blue-900 font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                <motion.li 
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/" className="text-blue-700 hover:text-blue-500 text-sm">Home</Link>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/assessment" className="text-blue-700 hover:text-blue-500 text-sm">Start Assessment</Link>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/admin" className="text-blue-700 hover:text-blue-500 text-sm">Admin</Link>
                </motion.li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-blue-900 font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <motion.li 
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="#" className="text-blue-700 hover:text-blue-500 text-sm">IT Career Guides</Link>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="#" className="text-blue-700 hover:text-blue-500 text-sm">Learning Resources</Link>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="#" className="text-blue-700 hover:text-blue-500 text-sm">Support</Link>
                </motion.li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-100 mt-8 pt-6 text-center">
            <p className="text-blue-700 text-sm">
              © {currentYear} IT Career Assessment. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}