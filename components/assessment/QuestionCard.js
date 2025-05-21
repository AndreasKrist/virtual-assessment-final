import React, { useState } from 'react';
import { useAssessment } from '../../contexts/AssessmentContext';
import Button from '../ui/Button';
import ProgressBar from './ProgressBar';

export default function QuestionCard() {
  const { 
    getCurrentQuestion, 
    recordAnswer, 
    nextStage, 
    prevStage, 
    answers,
    currentQuestionSet,
    getProgress
  } = useAssessment();
  
  const question = getCurrentQuestion();
  const progress = getProgress();
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Check if this question has been answered
  const currentAnswer = currentQuestionSet === 'general' 
    ? answers.general[question.id] 
    : answers.roleSpecific[question.id];
  
  const handleAnswer = (value) => {
    recordAnswer(question.id, value);
  };
  
  const handleNext = () => {
    // Only proceed if an answer has been selected
    if (currentAnswer !== undefined) {
      nextStage();
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 transition-all duration-150">
      <div className="p-10">
        <ProgressBar 
          current={progress.current + 1} 
          total={progress.total}
          className="mb-8"
        />
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-blue-800">
            {question.text}
          </h2>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="flex-1 transition-transform duration-100 hover:scale-[1.01] active:scale-[0.99]">
              <Button
                variant={currentAnswer === true ? 'primary' : 'outline'}
                className="w-full py-4 text-lg flex justify-center items-center"
                onClick={() => handleAnswer(true)}
              >
                <span className="flex items-center">
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
            </div>
            
            <div className="flex-1 transition-transform duration-100 hover:scale-[1.01] active:scale-[0.99]">
              <Button
                variant={currentAnswer === false ? 'primary' : 'outline'}
                className="w-full py-4 text-lg flex justify-center items-center"
                onClick={() => handleAnswer(false)}
              >
                <span className="flex items-center">
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
            <div className="mt-6">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-blue-600 text-sm font-medium flex items-center hover:translate-x-1 transition-transform duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 mr-1 transition-transform duration-150 ${showExplanation ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showExplanation ? 'Hide explanation' : 'Learn more about this topic'}
              </button>
              
              {showExplanation && (
                <div className="mt-4 p-6 bg-blue-50 rounded-lg text-sm border border-blue-100 transition-all duration-150">
                  <p className="text-blue-700">
                    This skill is covered in our <span className="font-semibold">{question.courseRecommendation}</span> course,
                    which helps you understand {question.category} concepts and practical applications.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="secondary" 
            onClick={prevStage}
            className="px-6 py-3 text-base"
          >
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={currentAnswer === undefined}
            className={`px-6 py-3 text-base ${currentAnswer !== undefined ? 'shadow-lg shadow-blue-500/20' : ''}`}
          >
            {progress.current + 1 === progress.total ? 'See Results' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}