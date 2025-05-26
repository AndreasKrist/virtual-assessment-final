import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '../../contexts/AssessmentContext';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function AvatarGuide() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [avatarExpression, setAvatarExpression] = useState('happy');
  const { stage, selectedRole, currentBatch, biodata, results } = useAssessment();
  const router = useRouter();
  const inactivityTimerRef = useRef(null);
  const lastInteractionRef = useRef(Date.now());
  
  // Get help message when user is inactive
  const getHelpMessage = useCallback(() => {
    const firstName = biodata.fullName ? biodata.fullName.split(' ')[0] : 'there';
    
    if (router.pathname === '/') {
      return `Hi ${firstName}! 👋 I noticed you're still here. To get started, please click the big blue "Start Assessment" button below. This will begin your personalized IT skills assessment!`;
    }
    
    if (router.pathname === '/results') {
      return `${firstName}, don't forget to save your results! 💾 Scroll down and click the "Save My Results" button to store your assessment. You can also click "Start Over" if you want to take the assessment again.`;
    }
    
    switch (stage) {
      case 'welcome':
        return `${firstName}, let's get started! 🌟 Click the "Start Assessment" button to begin your journey into IT career discovery!`;
      
      case 'biodata':
        return `${firstName}! 📝 I see you're on the information page. Please fill in all the required fields (marked with red *), then click the "Continue" button at the bottom to move to the next step. Don't worry, your information is safe with us!`;
      
      case 'roleSelection':
        return `${firstName}! 🎯 I see you need to choose your discipline. Click on either "Network Administrator" or "Cybersecurity" - the box will turn blue when selected. Then click the "Continue" button at the bottom to proceed with your chosen path!`;
      
      case 'generalQuestions':
        if (currentBatch === 0) {
          return `${firstName}! 💻 I notice you're looking at the general IT questions. For each question, click either "Yes" or "No" button to answer. After answering ALL questions on this page, click the blue "Continue" button at the bottom to move forward!`;
        } else {
          return `${firstName}! 🌟 You're doing great! These are the final general questions. Remember to click "Yes" or "No" for each question, then click "Continue" at the bottom when you've answered everything!`;
        }
      
      case 'roleQuestions':
        const roleName = selectedRole === 'networkAdmin' ? 'Network Administration' : 'Cybersecurity';
        if (currentBatch === 0) {
          return `${firstName}! 🎯 Now you're on the ${roleName} questions - excellent choice! Click "Yes" or "No" for each question based on your knowledge. Don't worry if you don't know something - that's normal! Click "Continue" when all questions are answered.`;
        } else {
          return `${firstName}! 🏁 These are your final ${roleName} questions - you're almost done! Answer each question with "Yes" or "No", then click "Continue" to see your personalized results!`;
        }
      
      default:
        return `${firstName}! 😊 I'm here to help guide you through the assessment. If you need assistance, just click on me anytime! Remember to click buttons as instructed to move through each step.`;
    }
  }, [biodata.fullName, router.pathname, stage, currentBatch, selectedRole]);
  
  // Reset inactivity timer whenever user interacts
  const resetInactivityTimer = useCallback(() => {
    lastInteractionRef.current = Date.now();
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Set new timer for auto-popup after 8 seconds of inactivity
    inactivityTimerRef.current = setTimeout(() => {
      if (!showMessage) {
        const helpMessage = getHelpMessage();
        setCurrentMessage(helpMessage);
        setAvatarExpression('helpful');
        setShowMessage(true);
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
          setShowMessage(false);
        }, 15000);
      }
    }, 8000);
  }, [showMessage, getHelpMessage]);

  // Track user interactions
  useEffect(() => {
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    // Listen for various user interactions
    const events = ['click', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Start the timer initially
    resetInactivityTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [showMessage, resetInactivityTimer]);
  
  // Get contextual messages based on current stage and page
  const getContextualMessage = useCallback(() => {
    const firstName = biodata.fullName ? biodata.fullName.split(' ')[0] : 'there';
    
    if (router.pathname === '/') {
      setAvatarExpression('welcoming');
      return `Hello ${firstName}! 👋 Welcome to ITEL's Tech Skills Assessment! I'm your personal guide and I'll help you every step of the way. 

🎯 **What to do now:** Click the big blue "Start Assessment" button below to begin discovering your IT potential! 

I'll be here throughout your journey to provide helpful tips and guidance. Let's get started! 🚀`;
    }
    
    if (router.pathname === '/results') {
      const successRate = results.successRate || 0;
      if (successRate >= 80) {
        setAvatarExpression('excited');
        return `Wow, ${firstName}! 🌟 Outstanding work! You scored ${successRate}%! 

🎉 **What this means:** You have excellent potential in your chosen field!

📋 **What to do now:** 
1. Review your personalized recommendations below
2. Click "Save My Results" to store your assessment
3. Contact ITEL about the recommended courses

You're on a great path to IT success! 🚀`;
      } else if (successRate >= 60) {
        setAvatarExpression('encouraging');
        return `Great job, ${firstName}! 👏 You scored ${successRate}% - that shows real potential!

💪 **What this means:** You have a solid foundation to build upon!

📋 **What to do now:**
1. Check your course recommendations below - they're designed just for you!
2. Click "Save My Results" to keep your assessment
3. Don't worry about areas you're unfamiliar with - that's why we have courses!

Every expert was once a beginner! 🌟`;
      } else {
        setAvatarExpression('supportive');
        return `Don't worry, ${firstName}! 💪 Everyone starts somewhere, and your ${successRate}% shows you're ready to learn!

🌱 **What this means:** You have great potential - you just need the right training!

📋 **What to do now:**
1. Look at your personalized course recommendations below
2. Click "Save My Results" so we can help you further
3. Remember: Every IT expert started exactly where you are now!

The courses I've recommended will build your confidence and skills step by step! 🚀`;
      }
    }
    
    switch (stage) {
      case 'welcome':
        setAvatarExpression('happy');
        return `Hi ${firstName}! 🌟 I'm so excited to help you discover your IT potential!

🎯 **What we'll do together:**
1. First, I'll ask for some basic information about you
2. Then you'll choose between Network Administration or Cybersecurity  
3. We'll go through some simple Yes/No questions
4. Finally, you'll get personalized course recommendations!

Ready to start this journey? I'll be with you every step of the way! 🚀`;
      
      case 'biodata':
        setAvatarExpression('curious');
        return `Perfect, ${firstName}! 📝 Now I need to get to know you a little better.

📋 **What to do here:**
1. Fill in your Full Name (required)
2. Enter your Email Address (required) 
3. Add your Phone Number (optional)
4. Select your Age Group (required)
5. Click the blue "Continue" button at the bottom

⚡ **Tip:** Look for the red * - those fields are required! Don't worry, your information is completely safe and secure with us. 🔒`;
      
      case 'roleSelection':
        setAvatarExpression('excited');
        return `This is exciting, ${firstName}! 🚀 Time to choose your IT adventure!

🎯 **What to do here:**
1. Read about both options: Network Administrator and Cybersecurity
2. Click on the box of your preferred choice (it will turn blue)
3. Click the "Continue" button at the bottom

💡 **Don't worry about choosing "wrong"** - both are fantastic careers! Pick the one that sounds more interesting to you. You can always change your mind later! 

Which one calls to you? 🤔`;
      
      case 'generalQuestions':
        if (currentBatch === 0) {
          setAvatarExpression('encouraging');
          return `Great job getting here, ${firstName}! 💻 Now for some basic IT questions.

📋 **How to answer these questions:**
1. Read each question carefully
2. Click "Yes" if you can do it, "No" if you can't
3. Be honest - there are no wrong answers!
4. If you click "No", you can click "Learn more" to see how we can help
5. After answering ALL questions, click "Continue" at the bottom

⚡ **Important:** Answer every single question before clicking Continue. Take your time! 🕐`;
        } else {
          setAvatarExpression('proud');
          return `You're doing amazing, ${firstName}! 🌟 These are the final general questions.

📋 **What to do:**
1. Continue answering "Yes" or "No" to each question
2. Remember, honesty helps us give you better recommendations
3. Answer every question on this page
4. Click "Continue" when you're completely done

🎉 **You're halfway through!** After this, we'll move to your specialized questions. Keep going! 💪`;
        }
      
      case 'roleQuestions':
        const roleName = selectedRole === 'networkAdmin' ? 'Network Administration' : 'Cybersecurity';
        if (currentBatch === 0) {
          setAvatarExpression('focused');
          return `Excellent choice, ${firstName}! 🎯 Now for ${roleName} specific questions.

📋 **What to do here:**
1. These questions are about your chosen field: ${roleName}
2. Click "Yes" if you know/can do it, "No" if you don't
3. Don't worry if you answer "No" to many - that's totally normal!
4. Answer ALL questions, then click "Continue"

💡 **Remember:** We're not testing you - we're learning how to help you succeed! Be honest so we can recommend the perfect courses. 🎓`;
        } else {
          setAvatarExpression('cheerful');
          return `Almost there, ${firstName}! 🏁 These are your final ${roleName} questions!

📋 **Final steps:**
1. Answer these last questions with "Yes" or "No"
2. Be honest about your current knowledge
3. Answer every single question
4. Click "Continue" to see your personalized results!

🎉 **You're about to see:** Your success rate, your strengths, areas to improve, and custom course recommendations just for you! Exciting! 🌟`;
        }
      
      case 'results':
        setAvatarExpression('celebrating');
        return `Congratulations, ${firstName}! 🎉 You've completed your assessment!

🏆 **What you've accomplished:**
✅ Completed your personal IT skills assessment
✅ Discovered your strengths and growth areas  
✅ Received personalized course recommendations
✅ Taken the first step toward your IT career!

🎯 **Next steps:** Review your results, save them, and consider the recommended courses. I'm so proud of you for taking this important step toward your future! 🌟`;
      
      default:
        setAvatarExpression('happy');
        return `Hey ${firstName}! 😊 I'm your friendly assessment guide, and I'm here to help you succeed!

💡 **Need help?** Just click on me anytime for guidance on what to do next. I'll give you step-by-step instructions to make this assessment easy and stress-free!

🚀 **Remember:** There are no wrong answers - we're here to discover how to help you succeed in IT!`;
    }
  }, [biodata.fullName, router.pathname, stage, currentBatch, selectedRole, results.successRate]);
  
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
      case 'helpful':
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
    
    // Auto-hide message after 12 seconds (longer for detailed messages)
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 12000);
    
    // Reset inactivity timer when stage changes
    resetInactivityTimer();
    
    return () => clearTimeout(timer);
  }, [stage, router.pathname, currentBatch, selectedRole, biodata.fullName, results.successRate, resetInactivityTimer, getContextualMessage]);
  
  // Toggle message visibility when avatar is clicked
  const handleAvatarClick = () => {
    if (showMessage) {
      setShowMessage(false);
    } else {
      const newMessage = getContextualMessage();
      setCurrentMessage(newMessage);
      setShowMessage(true);
      
      // Auto-hide after 12 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 12000);
    }
    
    // Reset activity timer when user clicks avatar
    resetInactivityTimer();
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
            className="absolute bottom-28 right-0 mb-4 w-80 sm:w-96 max-h-96 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 relative">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-base font-semibold text-blue-800">Your Personal Guide 🤖</h4>
                <button
                  onClick={() => setShowMessage(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-blue-700 leading-relaxed whitespace-pre-line">
                {currentMessage}
              </div>
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
          {/* Avatar Image - Using Next.js Image component instead of img */}
          <div className="relative w-full h-full">
            <Image
              src="/images/avatar.jpg"
              alt="Your Guide"
              fill
              sizes="(max-width: 768px) 96px, 96px"
              className="object-cover"
              onError={(e) => {
                // Fallback to SVG if image doesn't load
                const target = e.target;
                if (target && target.nextSibling) {
                  target.style.display = 'none';
                  target.nextSibling.style.display = 'block';
                }
              }}
            />
          </div>
          
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
          💬 Click for help!
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