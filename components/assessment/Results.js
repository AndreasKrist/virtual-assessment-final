import React from 'react';
import { useAssessment } from '../../contexts/AssessmentContext';
import Button from '../ui/Button';
import { useRouter } from 'next/router';

export default function Results() {
  const { results, selectedRole, resetAssessment } = useAssessment();
  const router = useRouter();
  
  // Map role IDs to readable names
  const roleNames = {
    networkAdmin: "Network Administration",  // CHANGED: Was "Network Administrator"
    cybersecurity: "Cybersecurity"
  };
  
  // Determine success rate color and message
  const getSuccessRateInfo = (rate) => {
    if (rate >= 90) {
      return { color: 'green', message: 'You have a very strong foundation for this courses.' };
    } else if (rate >= 80) {
      return { color: 'blue', message: 'You have a solid foundation but could benefit from specific courses.' };
    } else if (rate >= 60) {
      return { color: 'yellow', message: 'With some focused learning, you can improve your chances of success.' };
    } else {
      return { color: 'red', message: 'You may need more preparation before pursuing this role.' };
    }
  };
  
  const successRateInfo = getSuccessRateInfo(results.successRate);

  const handleStartOver = () => {
    resetAssessment();
    router.push('/');
  };
  
  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 transition-all duration-150">
      <div className="p-4 sm:p-6 lg:p-10">
        
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-blue-800">Your Assessment Summary</h2>
          <p className="text-sm sm:text-base text-blue-600">
            Based on your responses, here's your assessment summary analysis
          </p>
        </div>
        
        {/* MAIN CONTENT - No tabs, just the overview content */}
        <div>
          <div className="mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-sm sm:text-base font-semibold mb-1 text-blue-800 leading-tight">Here is your preliminary level of understanding in the area of {roleNames[selectedRole]}</h3>
                </div>
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-full border-4 sm:border-8 border-blue-100 flex-shrink-0">
                  <div className={`text-2xl sm:text-3xl font-bold ${
                    successRateInfo.color === 'red' ? 'text-red-600' : 
                    successRateInfo.color === 'yellow' ? 'text-yellow-600' : 
                    successRateInfo.color === 'blue' ? 'text-blue-600' : 
                    'text-green-600'
                  }`}>
                    {results.successRate}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-6">
              {/* Strengths */}
              <div className="p-4 sm:p-6 rounded-lg border border-blue-100 bg-blue-50/50">
                <h3 className="font-semibold mb-3 flex items-center text-green-600 text-sm sm:text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Your Strengths
                </h3>
                
                {results.strengths.length > 0 ? (
                  <ul className="space-y-1 sm:space-y-2">
                    {results.strengths.slice(0, 5).map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 mt-1.5 sm:mt-2 mr-2 flex-shrink-0"></span>
                        <span className="capitalize text-blue-700 text-xs sm:text-sm">{strength.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-blue-500 text-xs sm:text-sm italic">
                    No specific strengths identified.
                  </p>
                )}
              </div>
              
              {/* Areas for Improvement */}
              <div className="p-4 sm:p-6 rounded-lg border border-blue-100 bg-blue-50/50">
                <h3 className="font-semibold mb-3 flex items-center text-blue-600 text-sm sm:text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Areas for Improvement
                </h3>
                
                {results.weaknesses.length > 0 ? (
                  <ul className="space-y-1 sm:space-y-2">
                    {results.weaknesses.slice(0, 5).map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 mt-1.5 sm:mt-2 mr-2 flex-shrink-0"></span>
                        <span className="capitalize text-blue-700 text-xs sm:text-sm">{weakness.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-blue-500 text-xs sm:text-sm italic">
                    No specific areas for improvement identified.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-700 text-xs sm:text-sm">
              <span className="font-semibold"></span> Please feel free to contact ITEL to inquire about specific courses that can help you succeed in your chosen career path.
            </p>
          </div>
        </div>
        
        {/* Actions - Only Start Over button now */}
        <div className="flex justify-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-blue-100">
          <div className="text-center w-full">
            <Button 
              variant="outline" 
              onClick={handleStartOver}
              className="w-full sm:w-auto px-8 py-3 mb-2"
            >
              Start Over
            </Button>
            <p className="text-xs text-blue-600">
              👆 Click "Start Over" if you want to retake the assessment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 
  COURSE RECOMMENDATIONS CODE - SAVED FOR FUTURE USE
  
  This code was removed from the active component but preserved here for future updates:
  
  // Recommendations Tab Content (NOT CURRENTLY DISPLAYED)
  {activeTab === 'recommendations' && (
    <div>
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-blue-800">Recommended Courses</h3>
        <p className="text-blue-600 mb-4 text-sm sm:text-base">
          Based on your assessment, we recommend the following courses to help you succeed as a {roleNames[selectedRole]}:
        </p>
        
        {results.recommendations.length > 0 ? (
          <div className="space-y-3 sm:space-y-6">
            {results.recommendations.slice(0, 3).map((recommendation, index) => (
              <div key={index} className="border border-blue-100 rounded-lg overflow-hidden bg-white">
                <div className="bg-blue-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-blue-100">
                  <h4 className="font-medium text-blue-800 text-sm sm:text-base">{recommendation.courseDetails?.title || recommendation.courseName}</h4>
                </div>
                
                <div className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-blue-700 mb-3 sm:mb-4">
                    {recommendation.courseDetails?.description || "This course will help you develop essential skills in this area."}
                  </p>
                  
                  <div className="text-xs sm:text-sm space-y-1 sm:space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-blue-800 font-medium w-full sm:w-20">Duration:</span>
                      <span className="text-blue-700">{recommendation.courseDetails?.duration || '4-6 weeks'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-blue-800 font-medium w-full sm:w-20">Difficulty:</span>
                      <span className="text-blue-700">{recommendation.courseDetails?.difficulty || 'Beginner'}</span>
                    </div>
                    
                    {recommendation.courseDetails?.topics && (
                      <div className="mt-2">
                        <p className="text-blue-800 font-medium mb-1">Key Topics:</p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {recommendation.courseDetails.topics.slice(0, 4).map((topic, i) => (
                            <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 sm:p-8 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-600 text-base sm:text-lg">
              No specific course recommendations at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  )}

  // Tab Navigation (NOT CURRENTLY DISPLAYED)
  <div className="flex border-b border-blue-100 mb-4 sm:mb-6 overflow-x-auto">
    <button
      onClick={() => setActiveTab('overview')}
      className={`py-2 sm:py-3 px-3 sm:px-4 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
        activeTab === 'overview'
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-blue-500 hover:text-blue-700'
      } transition-colors duration-150`}
    >
      Overview
    </button>
    <button
      onClick={() => setActiveTab('recommendations')}
      className={`py-2 sm:py-3 px-3 sm:px-4 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
        activeTab === 'recommendations'
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-blue-500 hover:text-blue-700'
      } transition-colors duration-150`}
    >
      Course Recommendations
    </button>
  </div>
*/