import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAssessment } from '../contexts/AssessmentContext';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 10 }
  }
};

const CardButton = ({ children, onClick, className = '', isSelected = false }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' 
          : 'border-blue-100 hover:border-blue-300 bg-white'
      } p-8 shadow-sm hover:shadow-md ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

const PrimaryButton = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`btn btn-primary ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'pulse'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default function Home() {
  const router = useRouter();
  const { nextStage } = useAssessment();
  
  const handleStartAssessment = () => {
    nextStage();
    router.push('/assessment');
  };

  // Create ripple effect on button click
  useEffect(() => {
    function createRipple(e) {
      const button = e.currentTarget;
      
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - button.offsetLeft - diameter / 2}px`;
      circle.style.top = `${e.clientY - button.offsetTop - diameter / 2}px`;
      circle.classList.add('ripple');
      
      const ripple = button.getElementsByClassName('ripple')[0];
      if (ripple) {
        ripple.remove();
      }
      
      button.appendChild(circle);
    }
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', createRipple);
    });
    
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', createRipple);
      });
    };
  }, []);

  return (
    <Layout>
      <Head>
        <title>IT Career Assessment</title>
        <meta name="description" content="Discover your potential IT career path and get personalized course recommendations." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4 text-blue-900 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <span className="relative inline-block">
                Prelim Tech Skills Assessor
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                ></motion.span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-blue-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Unlock Your IT Potential with Personalized Course Recommendations.
            </motion.p>
          </div>
          
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="p-8">
              <motion.div 
                className="bg-blue-gradient rounded-xl p-8 mb-10"
                whileHover={{ boxShadow: '0 8px 30px rgba(66, 135, 245, 0.1)' }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-900 flex items-center">
                  <motion.span 
                    className="inline-block mr-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.span>
                  How It Works
                </h2>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div>
                    <ol className="space-y-6">
                      <motion.li variants={itemVariants} className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-lg mr-4">
                          1
                        </div>
                        <div className="mt-1">
                          <h3 className="font-semibold text-lg text-blue-800">Choose Your Career Interest</h3>
                          <p className="text-blue-700 text-sm mt-1">
                            Select between Network Administration or Cybersecurity
                          </p>
                        </div>
                      </motion.li>
                      
                      <motion.li variants={itemVariants} className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-lg mr-4">
                          2
                        </div>
                        <div className="mt-1">
                          <h3 className="font-semibold text-lg text-blue-800">Answer Simple Questions</h3>
                          <p className="text-blue-700 text-sm mt-1">
                            Answer yes/no questions about your current knowledge
                          </p>
                        </div>
                      </motion.li>
                    </ol>
                  </div>
                  
                  <div>
                    <ol className="space-y-6" start="3">
                      <motion.li variants={itemVariants} className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-lg mr-4">
                          3
                        </div>
                        <div className="mt-1">
                          <h3 className="font-semibold text-lg text-blue-800">Get Your Success Rate</h3>
                          <p className="text-blue-700 text-sm mt-1">
                            See your estimated success rate in your chosen path
                          </p>
                        </div>
                      </motion.li>
                      
                      <motion.li variants={itemVariants} className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-lg mr-4">
                          4
                        </div>
                        <div className="mt-1">
                          <h3 className="font-semibold text-lg text-blue-800">Receive Course Recommendations</h3>
                          <p className="text-blue-700 text-sm mt-1">
                            Get personalized course suggestions to improve your skills
                          </p>
                        </div>
                      </motion.li>
                    </ol>
                  </div>
                </motion.div>
              </motion.div>
              
              <h3 className="text-xl font-semibold mb-6 text-center text-blue-800">Choose Your Career Path</h3>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <CardButton>
                    <motion.div 
                      className="flex flex-col items-center text-center"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.div 
                        className="mb-4 text-blue-500 float"
                        initial={{ y: 0 }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                          <line x1="6" y1="6" x2="6.01" y2="6"></line>
                          <line x1="6" y1="18" x2="6.01" y2="18"></line>
                          <path d="M6 10v4"></path>
                          <path d="M12 10v4"></path>
                          <path d="M18 10v4"></path>
                        </svg>
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold mb-2 text-blue-800">Network Administration</h3>
                      <p className="text-blue-700 mb-4">
                        Set up, maintain, and troubleshoot network systems to keep organizations connected.
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1.5 bg-blue-100 rounded-full text-xs text-blue-600 font-medium">
                          Network Configuration
                        </span>
                        <span className="px-3 py-1.5 bg-blue-100 rounded-full text-xs text-blue-600 font-medium">
                          Troubleshooting
                        </span>
                        <span className="px-3 py-1.5 bg-blue-100 rounded-full text-xs text-blue-600 font-medium">
                          System Maintenance
                        </span>
                      </div>
                    </motion.div>
                  </CardButton>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <CardButton>
                    <motion.div 
                      className="flex flex-col items-center text-center"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <motion.div 
                        className="mb-4 text-blue-500 float"
                        initial={{ y: 0 }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold mb-2 text-blue-800">Cybersecurity</h3>
                      <p className="text-blue-700 mb-4">
                        Protect systems and data from digital attacks and security threats.
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1.5 bg-blue-100 rounded-full text-xs text-blue-600 font-medium">
                          Threat Detection
                        </span>
                        <span className="px-3 py-1.5 bg-blue-100 rounded-full text-xs text-blue-600 font-medium">
                          Security Protocols
                        </span>
                        <span className="px-3 py-1.5 bg-blue-100 rounded-full text-xs text-blue-600 font-medium">
                          Risk Assessment
                        </span>
                      </div>
                    </motion.div>
                  </CardButton>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="text-center mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <PrimaryButton 
                  onClick={handleStartAssessment}
                  className="px-8 py-4 text-lg"
                >
                  Start Assessment
                </PrimaryButton>
                
                <motion.p 
                  className="mt-4 text-sm text-blue-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  Takes only 3-7 minutes to complete
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}