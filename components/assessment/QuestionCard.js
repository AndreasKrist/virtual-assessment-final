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
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <ProgressBar 
          current={progress.current + 1} 
          total={progress.total}
          className="mb-8"
        />
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">{question.text}</h2>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              variant={currentAnswer === true ? 'primary' : 'outline'}
              className="flex-1 flex justify-center"
              onClick={() => handleAnswer(true)}
            >
              Yes
            </Button>
            
            <Button
              variant={currentAnswer === false ? 'primary' : 'outline'}
              className="flex-1 flex justify-center"
              onClick={() => handleAnswer(false)}
            >
              No
            </Button>
          </div>
          
          {currentAnswer === false && (
            <div className="mt-6">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 mr-1 transition-transform duration-200 ${showExplanation ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showExplanation ? 'Hide explanation' : 'Learn more about this topic'}
              </button>
              
              {showExplanation && (
                <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
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
          >
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={currentAnswer === undefined}
          >
            {progress.current + 1 === progress.total ? 'See Results' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}