import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../contexts/AssessmentContext';
import Button from '../ui/Button';
import ProgressBar from './ProgressBar';
import { useRouter } from 'next/router';
import { saveUserData } from '../../lib/saveUserData';
import { saveToGoogleSheet } from '../../lib/googleSheets';

export default function QuestionBatch() {
  const { 
    getCurrentBatch, 
    recordBatchAnswers, 
    nextStage, 
    prevStage, 
    answers,
    currentQuestionSet,
    getBatchProgress,
    currentBatch,
    selectedRole,
    goBackToRoleSelection,
    resetAssessment,
    biodata,
    calculateResults // Make sure this is imported
  } = useAssessment();
  
  const questions = getCurrentBatch();
  const progress = getBatchProgress();
  const [batchAnswers, setBatchAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [showCategoryConfirm, setShowCategoryConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  // Scroll to top when component mounts or batch changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentBatch, currentQuestionSet]);
  
  // Get current answers for this batch
  const getCurrentAnswers = () => {
    const currentAnswers = {};
    questions.forEach(question => {
      const answered = currentQuestionSet === 'general' 
        ? answers.general[question.id] 
        : answers.roleSpecific[question.id];
      if (answered !== undefined) {
        currentAnswers[question.id] = answered;
      }
    });
    return { ...currentAnswers, ...batchAnswers };
  };
  
  const handleAnswer = (questionId, value) => {
    console.log('Direct answer update:', questionId, value);
    
    // Update local state
    setBatchAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // ALSO update global state immediately
    const immediateAnswer = { [questionId]: value };
    recordBatchAnswers(immediateAnswer);
    
    // IMPROVED AUTO-SCROLL LOGIC - Less aggressive for mobile
    setTimeout(() => {
      const currentQuestionIndex = questions.findIndex(q => q.id === questionId);
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      // If there's a next question in this batch, scroll to it
      if (nextQuestionIndex < questions.length) {
        const nextQuestionElement = document.getElementById(`question-${questions[nextQuestionIndex].id}`);
        if (nextQuestionElement) {
          // Check if we're on mobile
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            // More gentle scroll for mobile - just scroll into view without centering
            nextQuestionElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' // Less aggressive than 'center'
            });
          } else {
            // Desktop can handle center scrolling
            nextQuestionElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
            });
          }
        }
      } else {
        // If this was the last question, gently scroll to continue button
        const continueButton = document.getElementById('continue-button');
        if (continueButton) {
          continueButton.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' // Less aggressive scroll
          });
        }
      }
    }, 200); // Slightly faster response
  };
  
  const toggleExplanation = (questionId) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Check if this is the final batch (last questions)
  const isFinalBatch = () => {
    return currentQuestionSet === 'roleSpecific' && currentBatch === 1;
  };
  
  const handleNext = async () => {
    const allAnswers = getCurrentAnswers();
    
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => allAnswers[q.id] === undefined);
    if (unansweredQuestions.length > 0) {
      // Scroll to first unanswered question - gentle scroll
      const firstUnanswered = unansweredQuestions[0];
      const element = document.getElementById(`question-${firstUnanswered.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }
    
    // Record all answers for this batch first
    recordBatchAnswers(allAnswers);
    
    // If this is the final batch, save and calculate results
    if (isFinalBatch()) {
      setIsSaving(true);
      
      // Wait for state to update, then calculate and proceed
      setTimeout(() => {
        try {
          // Calculate results and get the actual calculated data
          const calculatedResults = calculateResults();
          
          // Save in background using ACTUAL calculated results
          setTimeout(async () => {
            try {
              const roleNames = {
                networkAdmin: "Network Administrator",
                cybersecurity: "Cybersecurity"
              };
              
              const resultsForSaving = {
                role: selectedRole,
                roleName: roleNames[selectedRole],
                successRate: calculatedResults.successRate, // Use ACTUAL calculated rate
                strengths: calculatedResults.strengths, // Keep as array - let googleSheets.js handle the joining
                weaknesses: calculatedResults.weaknesses, // Keep as array - let googleSheets.js handle the joining
                recommendations: calculatedResults.recommendations.map(rec => 
                  typeof rec === 'string' ? rec : rec.courseName
                ) // Keep as array - let googleSheets.js handle the joining
              };
              
              await saveUserData(biodata, resultsForSaving);
              await saveToGoogleSheet({ ...biodata, results: resultsForSaving });
              
            } catch (error) {
              console.error('Background save error:', error);
            }
          }, 100);
          
          // Move to next stage
          setTimeout(() => {
            setIsSaving(false);
            nextStage();
          }, 300);
          
        } catch (error) {
          console.error('Error processing final batch:', error);
          setIsSaving(false);
          nextStage();
        }
      }, 200);
      
    } else {
      // Reset local state for next batch
      setBatchAnswers({});
      setShowExplanations({});
      
      // Move to next stage
      nextStage();
    }
  };
  
  const allAnswered = () => {
    const allAnswers = getCurrentAnswers();
    return questions.every(q => allAnswers[q.id] !== undefined);
  };
  
  const getBatchTitle = () => {
    if (currentQuestionSet === 'general') {
      return currentBatch === 0 ? 'General IT Skills - Part 1' : 'General IT Skills - Part 2';
    } else {
      return currentBatch === 0 ? `${getCourseName()} - Part 1` : `${getCourseName()} - Part 2`;
    }
  };
  
  const getCourseName = () => {
    const roleNames = {
      networkAdmin: "Network Administration",
      cybersecurity: "Cybersecurity"
    };
    return currentQuestionSet === 'general' ? 'General IT Skills' : roleNames[selectedRole];
  };

  const handleCategoryChange = () => {
    setShowCategoryConfirm(false);
    goBackToRoleSelection();
  };

  const handleStartOver = () => {
    resetAssessment();
    router.push('/');
  };

  return (
    <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Start Over Button */}
        <div className="flex justify-center mb-4">
          <Button 
            variant="outline" 
            onClick={handleStartOver}
            className="px-6 py-2 text-sm"
          >
            🔄 Start Over
          </Button>
        </div>

        <ProgressBar 
          current={progress.current} 
          total={progress.total}
          className="mb-4 sm:mb-6"
        />

        {/* Change Category Button - Mobile Optimized */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <button
              onClick={() => setShowCategoryConfirm(!showCategoryConfirm)}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="hidden sm:inline">Change Category</span>
              <span className="sm:hidden">Change</span>
            </button>
            
            {/* Confirmation Dialog */}
            {showCategoryConfirm && (
              <div className="absolute left-1/2 transform -translate-x-1/2 top-12 bg-white rounded-lg shadow-lg border border-blue-200 p-4 w-72 sm:w-80 z-10 mx-4">
                <h4 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Change Course Category?</h4>
                <p className="text-xs sm:text-sm text-blue-600 mb-4">
                  This will reset your current progress and take you back to choose a different course category.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCategoryConfirm(false)}
                    className="px-3 py-2 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCategoryChange}
                    className="px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Change Category
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
          
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-2">
            {getBatchTitle()}
          </h2>
          <p className="text-sm sm:text-base text-blue-600 mb-4">
            Answer all questions below, then click Continue
          </p>
        </div>

        {/* Detailed Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700 text-center text-sm">
            📋 For each question below, click either "Yes" or "No" to answer. After answering all questions, click the "Continue" button at the bottom to move to the next section.
          </p>
        </div>
        
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {questions.map((question, index) => {
            const allAnswers = getCurrentAnswers();
            const currentAnswer = allAnswers[question.id];
            
            return (
              <div 
                key={question.id} 
                id={`question-${question.id}`}
                className="border border-blue-100 rounded-xl p-4 sm:p-6 bg-blue-50/30"
              >
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-medium text-blue-800 mb-4 leading-relaxed">
                    {index + 1}. {question.text}
                  </h3>
                  
                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-3">
                    <Button
                      variant={currentAnswer === true ? 'primary' : 'outline'}
                      className="flex-1 py-3 sm:py-3 text-base font-medium min-h-[48px]"
                      onClick={() => handleAnswer(question.id, true)}
                    >
                      <span className="flex items-center justify-center">
                        {currentAnswer === true && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        Yes
                      </span>
                    </Button>
                    
                    <Button
                      variant={currentAnswer === false ? 'primary' : 'outline'}
                      className="flex-1 py-3 sm:py-3 text-base font-medium min-h-[48px]"
                      onClick={() => handleAnswer(question.id, false)}
                    >
                      <span className="flex items-center justify-center">
                        {currentAnswer === false && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        No
                      </span>
                    </Button>
                  </div>
                </div>
                
                {currentAnswer === false && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleExplanation(question.id)}
                      className="text-blue-600 text-sm font-medium flex items-center hover:translate-x-1 transition-transform duration-150 min-h-[44px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 mr-1 transition-transform duration-150 ${showExplanations[question.id] ? 'rotate-90' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {showExplanations[question.id] ? 'Hide explanation' : 'Learn more about this topic'}
                    </button>
                    
                    {showExplanations[question.id] && (
                      <div className="mt-3 p-4 bg-blue-50 rounded-lg text-sm border border-blue-100">
                        <p className="text-blue-700">
                          This skill is covered in our <span className="font-semibold">{question.courseRecommendation}</span> course,
                          which helps you understand {question.category} concepts and practical applications.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* FIXED BUTTON ALIGNMENT - Both buttons now have exact same styling */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-blue-100 space-y-4 sm:space-y-0 sm:gap-4">
          <div className="w-full sm:flex-1 text-center">
            <Button 
              variant="secondary" 
              onClick={prevStage}
              className="w-full sm:w-auto px-8 py-3 min-h-[48px] mb-2"
              disabled={isSaving}
            >
              Back
            </Button>
            <p className="text-xs text-blue-600">
              👆 Click "Back" to go to the previous section
            </p>
          </div>
          
          <div className="w-full sm:flex-1 flex flex-col items-center space-y-3 sm:space-y-0">
            {!allAnswered() && (
              <span className="text-xs sm:text-sm text-blue-600 text-center mb-2">
                Please answer all questions to continue
              </span>
            )}
            <Button 
              onClick={handleNext}
              disabled={!allAnswered() || isSaving}
              className={`w-full sm:w-auto px-8 py-3 min-h-[48px] mb-2 ${allAnswered() && !isSaving ? 'shadow-lg shadow-blue-500/20' : ''}`}
              id="continue-button"
            >
              {isSaving ? 'Saving...' : 'Continue'}
            </Button>
            <p className="text-xs text-blue-600 text-center">
              {isSaving ? "📤 Processing..." :
               !allAnswered() ? "👆 Answer all questions above first" :
               "👆 Click 'Continue' to move to the next section"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}