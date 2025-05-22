import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../contexts/AssessmentContext';
import Button from '../ui/Button';
import ProgressBar from './ProgressBar';

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
    goBackToRoleSelection
  } = useAssessment();
  
  const questions = getCurrentBatch();
  const progress = getBatchProgress();
  const [batchAnswers, setBatchAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [showCategoryConfirm, setShowCategoryConfirm] = useState(false);
  
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
  
  // AUTO-SCROLL LOGIC (this is what you're missing!)
  setTimeout(() => {
    const currentQuestionIndex = questions.findIndex(q => q.id === questionId);
    const nextQuestionIndex = currentQuestionIndex + 1;
    
    // If there's a next question in this batch, scroll to it
    if (nextQuestionIndex < questions.length) {
      const nextQuestionElement = document.getElementById(`question-${questions[nextQuestionIndex].id}`);
      if (nextQuestionElement) {
        nextQuestionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' // Centers the question in the viewport
        });
      }
    } else {
      // If this was the last question, scroll to the continue button
      const continueButton = document.getElementById('continue-button');
      if (continueButton) {
        continueButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, 200); // Small delay to let the UI update first
};
  
  const toggleExplanation = (questionId) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  const handleNext = () => {
    const allAnswers = getCurrentAnswers();
    
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => allAnswers[q.id] === undefined);
    if (unansweredQuestions.length > 0) {
      // Could show an error message here
      return;
    }
    
    // Record all answers for this batch
    recordBatchAnswers(allAnswers);
    
    // Reset local state for next batch
    setBatchAnswers({});
    setShowExplanations({});
    
    // Move to next stage
    nextStage();
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

  return (
    <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
      <div className="p-8">

        <ProgressBar 
          current={progress.current} 
          total={progress.total}
          className="mb-6"
        />
                  {/* Change Category Button - Centered */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <button
                onClick={() => setShowCategoryConfirm(!showCategoryConfirm)}
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Change Category
              </button>
              
              {/* Confirmation Dialog */}
              {showCategoryConfirm && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-12 bg-white rounded-lg shadow-lg border border-blue-200 p-4 w-80 z-10">
                  <h4 className="font-medium text-blue-800 mb-2">Change Course Category?</h4>
                  <p className="text-sm text-blue-600 mb-4">
                    This will reset your current progress and take you back to choose a different course category.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCategoryConfirm(false)}
                      className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCategoryChange}
                      className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Change Category
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">
            {getBatchTitle()}
          </h2>
          <p className="text-blue-600 mb-4">
            Answer all questions below, then click Continue
          </p>
          

        </div>
        
        <div className="space-y-6 mb-8">
          {questions.map((question, index) => {
            const allAnswers = getCurrentAnswers();
            const currentAnswer = allAnswers[question.id];
            
            return (
              <div 
                key={question.id} 
                id={`question-${question.id}`}
                className="border border-blue-100 rounded-xl p-6 bg-blue-50/30"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-4">
                    {index + 1}. {question.text}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant={currentAnswer === true ? 'primary' : 'outline'}
                      className="flex-1 py-3 text-base"
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
                      className="flex-1 py-3 text-base"
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
                      className="text-blue-600 text-sm font-medium flex items-center hover:translate-x-1 transition-transform duration-150"
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
        
        <div className="flex justify-between items-center pt-6 border-t border-blue-100">
          <Button 
            variant="secondary" 
            onClick={prevStage}
            className="px-6 py-3"
          >
            Back
          </Button>
          
          <div className="flex items-center">
            {!allAnswered() && (
              <span className="text-sm text-blue-600 mr-4">
                Please answer all questions to continue
              </span>
            )}
            <Button 
              onClick={handleNext}
              disabled={!allAnswered()}
              className={`px-8 py-3 ${allAnswered() ? 'shadow-lg shadow-blue-500/20' : ''}`}
              id="continue-button"
            >
              {progress.current === progress.total ? 'See Results' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}