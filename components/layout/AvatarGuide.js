import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '../../contexts/AssessmentContext';
import { useRouter } from 'next/router';

export default function AvatarGuide() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [avatarExpression, setAvatarExpression] = useState('happy');
  const { stage, selectedRole, currentBatch, biodata, results } = useAssessment();
  const router = useRouter();
  
  // Get contextual messages based on current stage and page
  const getContextualMessage = () => {
    const firstName = biodata.fullName ? biodata.fullName.split(' ')[0] : 'there';
    
    if (router.pathname === '/') {
      setAvatarExpression('welcoming');
      return `Hello ${firstName}! 👋 Welcome to ITEL's Prelim Tech Skills Assessor. I'm here to guide you through your journey. Click "Start Assessment" when you're ready to discover your IT potential!`;
    }
    
    if (router.pathname === '/results') {
      const successRate = results.successRate || 0;
      if (successRate >= 80) {
        setAvatarExpression('excited');
        return `Wow, ${firstName}! 🌟 You scored ${successRate}%! That's fantastic! You have great potential in your chosen field. Check out your personalized recommendations below!`;
      } else if (successRate >= 60) {
        setAvatarExpression('encouraging');
        return `Great job, ${firstName}! 👏 You scored ${successRate}%. There's definitely potential here! The recommended courses will help you build on your foundation.`;
      } else {
        setAvatarExpression('supportive');
        return `Don't worry, ${firstName}! 💪 Everyone starts somewhere. Your ${successRate}% shows you're ready to learn. The courses I've recommended will set you on the right path!`;
      }
    }
    
    switch (stage) {
      case 'welcome':
        setAvatarExpression('happy');
        return `Hi ${firstName}! 🌟 Ready to start your IT career assessment? I'll be with you every step of the way!`;
      
      case 'biodata':
        setAvatarExpression('curious');
        return `Nice to meet you! 📝 Please fill in your basic information so I can personalize your experience. Don't worry, your data is completely safe with us!`;
      
      case 'roleSelection':
        setAvatarExpression('excited');
        return `This is exciting, ${firstName}! 🚀 Time to choose your adventure! Are you drawn to Network Administration or Cybersecurity? Both are amazing fields - pick what excites you most!`;
      
      case 'generalQuestions':
        if (currentBatch === 0) {
          setAvatarExpression('encouraging');
          return `Alright ${firstName}, let's dive in! 💻 These general IT questions help me understand your current foundation. Remember, there are no wrong answers - just answer honestly!`;
        } else {
          setAvatarExpression('proud');
          return `You're doing amazing, ${firstName}! 🌟 Just a few more general questions to go. I can see you're really thinking about each one - keep it up!`;
        }
      
      case 'roleQuestions':
        const roleName = selectedRole === 'networkAdmin' ? 'Network Administration' : 'Cybersecurity';
        if (currentBatch === 0) {
          setAvatarExpression('focused');
          return `Now for the fun part, ${firstName}! 🎯 These ${roleName} questions will help me understand your specialized knowledge. You've chosen such an interesting field!`;
        } else {
          setAvatarExpression('cheerful');
          return `Almost at the finish line, ${firstName}! 🏁 These final ${roleName} questions will complete your assessment. You're doing wonderfully!`;
        }
      
      case 'results':
        setAvatarExpression('celebrating');
        return `Congratulations, ${firstName}! 🎉 You've completed your assessment! I'm so proud of you for taking this important step. Your results and recommendations are ready!`;
      
      default:
        setAvatarExpression('happy');
        return `Hey ${firstName}! 😊 I'm your friendly assessment guide. I'm here to help you through this journey - feel free to click on me anytime if you need encouragement!`;
    }
  };
  
  // Different avatar expressions
  const getAvatarExpression = () => {
    switch (avatarExpression) {
      case 'happy':
        return (
          <>
            <circle cx="45" cy="32" r="1.5" fill="white" />
            <circle cx="55" cy="32" r="1.5" fill="white" />
            <path d="M 42 38 Q 50 44 58 38" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'excited':
        return (
          <>
            <ellipse cx="45" cy="32" rx="2" ry="1.5" fill="white" />
            <ellipse cx="55" cy="32" rx="2" ry="1.5" fill="white" />
            <ellipse cx="50" cy="40" rx="4" ry="3" fill="white" />
          </>
        );
      case 'encouraging':
        return (
          <>
            <circle cx="45" cy="32" r="1.5" fill="white" />
            <circle cx="55" cy="32" r="1.5" fill="white" />
            <path d="M 44 38 Q 50 42 56 38" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'welcoming':
        return (
          <>
            <path d="M 43 30 Q 45 28 47 30" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 53 30 Q 55 28 57 30" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="40" r="3" fill="white" />
          </>
        );
      default:
        return (
          <>
            <circle cx="45" cy="32" r="1.5" fill="white" />
            <circle cx="55" cy="32" r="1.5" fill="white" />
            <path d="M 42 38 Q 50 44 58 38" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        );
    }
  };
  
  // Update message when stage changes
  useEffect(() => {
    const newMessage = getContextualMessage();
    setCurrentMessage(newMessage);
    setShowMessage(true);
    
    // Auto-hide message after 10 seconds (longer for more complex messages)
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [stage, router.pathname, currentBatch, selectedRole, biodata.fullName, results.successRate]);
  
  // Toggle message visibility when avatar is clicked
  const handleAvatarClick = () => {
    if (showMessage) {
      setShowMessage(false);
    } else {
      const newMessage = getContextualMessage();
      setCurrentMessage(newMessage);
      setShowMessage(true);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 10000);
    }
  };
  
  // Don't show on admin page
  if (router.pathname === '/admin') {
    return null;
  }
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Message Bubble - Much Wider and Better Positioned */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-28 right-0 mb-4 w-80 sm:w-96"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 relative">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-base font-semibold text-blue-800">Your Guide</h4>
                <button
                  onClick={() => setShowMessage(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-base text-blue-700 leading-relaxed">
                {currentMessage}
              </p>
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 right-12 transform translate-y-full">
                <div className="w-0 h-0 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent border-t-white"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-200"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bigger Avatar */}
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAvatarClick}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-400"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Bigger Avatar Container */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-xl border-4 border-white overflow-hidden">
          {/* Avatar Image */}
          <img
            src="/images/avatar.jpg"
            alt="Your Guide"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to SVG if image doesn't load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          
          {/* Fallback SVG (hidden by default) */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-white absolute inset-0"
            fill="currentColor"
            style={{ display: 'none' }}
          >
            {/* Head */}
            <circle cx="50" cy="35" r="12" />
            {/* Body */}
            <ellipse cx="50" cy="65" rx="18" ry="15" />
            {/* Dynamic expression */}
            {getAvatarExpression()}
          </svg>
          
          {/* Animated status indicator */}
          <motion.div
            className="absolute top-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Minimize button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute -top-3 -left-3 w-8 h-8 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-500 text-sm shadow-md transition-colors border border-gray-200"
          title="Hide Guide"
        >
          ×
        </button>
      </motion.div>
      
      {/* Floating hint when not showing message */}
      {!showMessage && (
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-2 rounded-full whitespace-nowrap shadow-lg"
          animate={{
            y: [-2, 2, -2],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💬 Need help?
        </motion.div>
      )}
      
      {/* Re-enable button when hidden - Bigger */}
      {!isVisible && (
        <motion.button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-colors text-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Show guide"
        >
          💬
        </motion.button>
      )}
    </div>
  );
}