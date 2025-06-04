import React, { createContext, useContext, useState, useEffect } from 'react';
import { generalQuestions, roleQuestions, courseCatalog } from '../data/questions';

const AssessmentContext = createContext();

export function useAssessment() {
  return useContext(AssessmentContext);
}

export function AssessmentProvider({ children }) {
  // User information
  const [biodata, setBiodata] = useState({
    fullName: '',
    email: '',
    phone: '',
    ageGroup: '',
  });

  // Selected role
  const [selectedRole, setSelectedRole] = useState(null);

  // Current assessment stage
  const [stage, setStage] = useState('welcome');

  // Current batch index (0 or 1 for each question set)
  const [currentBatch, setCurrentBatch] = useState(0);

  // Question set being used (general or role-specific)
  const [currentQuestionSet, setCurrentQuestionSet] = useState('general');

  // All answers
  const [answers, setAnswers] = useState({
    general: {},
    roleSpecific: {}
  });

  // Assessment results
  const [results, setResults] = useState({
    successRate: 0,
    recommendations: [],
    strengths: [],
    weaknesses: []
  });

  // Initialize with clean state
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Set biodata information
  const updateBiodata = (data) => {
    setBiodata({ ...biodata, ...data });
  };

  // Select role
  const selectRole = (role) => {
    setSelectedRole(role);
  };

  // Switch role during assessment (keeps biodata, resets questions)
  const switchRole = (newRole) => {
    setSelectedRole(newRole);
    // Reset answers and go back to general questions
    setAnswers({
      general: {},
      roleSpecific: {}
    });
    setStage('generalQuestions');
    setCurrentQuestionSet('general');
    setCurrentBatch(0);
  };

  // Go back to role selection (keeps biodata, resets questions)
  const goBackToRoleSelection = () => {
    setAnswers({
      general: {},
      roleSpecific: {}
    });
    setStage('roleSelection');
    setCurrentQuestionSet('general');
    setCurrentBatch(0);
  };

  // Start assessment
  const startAssessment = () => {
    resetAssessment();
    setStage('biodata');
  };

  // Get current batch of questions (5 questions at a time)
  const getCurrentBatch = () => {
    const questions = currentQuestionSet === 'general' 
      ? generalQuestions 
      : roleQuestions[selectedRole];
    
    const startIndex = currentBatch * 5;
    const endIndex = startIndex + 5;
    return questions.slice(startIndex, endIndex);
  };

  // Record answers for a batch of questions
  const recordBatchAnswers = (batchAnswers) => {
    if (currentQuestionSet === 'general') {
      setAnswers({
        ...answers,
        general: {
          ...answers.general,
          ...batchAnswers
        }
      });
    } else {
      setAnswers({
        ...answers,
        roleSpecific: {
          ...answers.roleSpecific,
          ...batchAnswers
        }
      });
    }
  };

  // Move to the next stage
  const nextStage = () => {
    switch (stage) {
      case 'welcome':
        setStage('biodata');
        break;
      case 'biodata':
        setStage('roleSelection');
        break;
      case 'roleSelection':
        setStage('generalQuestions');
        setCurrentQuestionSet('general');
        setCurrentBatch(0);
        break;
      case 'generalQuestions':
        if (currentBatch === 0) {
          // Move to second batch of general questions
          setCurrentBatch(1);
        } else {
          // Move to role-specific questions
          setStage('roleQuestions');
          setCurrentQuestionSet('roleSpecific');
          setCurrentBatch(0);
        }
        break;
      case 'roleQuestions':
        if (currentBatch === 0) {
          // Move to second batch of role questions
          setCurrentBatch(1);
        } else {
          // Calculate results and move to results
          calculateResults();
          setStage('results');
        }
        break;
      default:
        break;
    }
  };

  // Go back to previous stage
  const prevStage = () => {
    switch (stage) {
      case 'biodata':
        setStage('welcome');
        break;
      case 'roleSelection':
        setStage('biodata');
        break;
      case 'generalQuestions':
        if (currentBatch === 1) {
          // Go back to first batch of general questions
          setCurrentBatch(0);
        } else {
          // Go back to role selection
          setStage('roleSelection');
        }
        break;
      case 'roleQuestions':
        if (currentBatch === 1) {
          // Go back to first batch of role questions
          setCurrentBatch(0);
        } else {
          // Go back to general questions (second batch)
          setStage('generalQuestions');
          setCurrentQuestionSet('general');
          setCurrentBatch(1);
        }
        break;
      default:
        break;
    }
  };

  // FIXED: Calculate assessment results with proper category analysis
  const calculateResults = () => {
    console.log('=== CALCULATING RESULTS ===');
    console.log('General answers:', answers.general);
    console.log('Role-specific answers:', answers.roleSpecific);
    console.log('Selected role:', selectedRole);
    
    // Count 'yes' answers
    const generalYesCount = Object.values(answers.general).filter(answer => answer === true).length;
    const roleYesCount = Object.values(answers.roleSpecific).filter(answer => answer === true).length;
    
    // Calculate success rate with weighting
    const generalWeight = 0.4;
    const roleWeight = 0.6;
    
    const generalScore = generalYesCount / generalQuestions.length;
    const roleScore = roleYesCount / roleQuestions[selectedRole].length;
    
    // Apply curve to the scores with a minimum base of 55%
    const curveScore = (score) => {
      if (score <= 0.5) {
        return 0.55 + (score * 0.4); 
      } else {
        return 0.75 + (score - 0.5) * (0.15 / 0.3);
      }
    };
    
    const curvedGeneralScore = curveScore(generalScore);
    const curvedRoleScore = curveScore(roleScore);
    
    const weightedScore = (curvedGeneralScore * generalWeight) + (curvedRoleScore * roleWeight);
    const finalSuccessRate = Math.max(55, Math.round(weightedScore * 100));
    
    // FIXED: Group questions by category and calculate percentage for each category
    const categoryStats = {};
    const recommendations = [];
    
    // Process general questions
    generalQuestions.forEach(question => {
      const category = question.category;
      const answered = answers.general[question.id];
      
      if (!categoryStats[category]) {
        categoryStats[category] = {
          total: 0,
          correct: 0,
          questions: [],
          isRoleSpecific: false
        };
      }
      
      categoryStats[category].total++;
      categoryStats[category].questions.push(question);
      
      if (answered === true) {
        categoryStats[category].correct++;
      } else if (answered === false) {
        recommendations.push({
          questionId: question.id,
          questionText: question.text,
          courseName: question.courseRecommendation,
          category: question.category,
          courseDetails: courseCatalog[question.courseRecommendation] || null
        });
      }
    });
    
    // Process role-specific questions
    if (selectedRole && roleQuestions[selectedRole]) {
      roleQuestions[selectedRole].forEach(question => {
        const category = question.category;
        const answered = answers.roleSpecific[question.id];
        
        if (!categoryStats[category]) {
          categoryStats[category] = {
            total: 0,
            correct: 0,
            questions: [],
            isRoleSpecific: true
          };
        }
        
        categoryStats[category].total++;
        categoryStats[category].questions.push(question);
        
        if (answered === true) {
          categoryStats[category].correct++;
        } else if (answered === false) {
          recommendations.push({
            questionId: question.id,
            questionText: question.text,
            courseName: question.courseRecommendation,
            category: question.category,
            courseDetails: courseCatalog[question.courseRecommendation] || null
          });
        }
      });
    }
    
    console.log('Category stats:', categoryStats);
    
    // FIXED: Determine strengths and weaknesses based on category performance
    const strengths = [];
    const weaknesses = [];
    
    Object.entries(categoryStats).forEach(([category, stats]) => {
      const percentage = stats.correct / stats.total;
      console.log(`Category: ${category}, Correct: ${stats.correct}/${stats.total} = ${(percentage * 100).toFixed(1)}%`);
      
      // FIXED: More balanced thresholds for strengths and weaknesses
      if (percentage >= 0.8) {
        // 80% or more correct answers = strength
        strengths.push(category);
        console.log(`✅ ${category} added to STRENGTHS (${(percentage * 100).toFixed(1)}%)`);
      } else if (percentage <= 0.4) {
        // 40% or less correct answers = weakness  
        weaknesses.push(category);
        console.log(`❌ ${category} added to WEAKNESSES (${(percentage * 100).toFixed(1)}%)`);
      } else {
        console.log(`➖ ${category} is NEUTRAL (${(percentage * 100).toFixed(1)}%)`);
      }
    });
    
    console.log('Final strengths:', strengths);
    console.log('Final weaknesses:', weaknesses);
    
    // Sort and limit recommendations (prioritize role-specific)
    recommendations.sort((a, b) => {
      // Get the role-specific question prefixes
      const rolePrefix = selectedRole === 'networkAdmin' ? 'network' : 'cyber';
      const aIsRoleSpecific = a.questionId.toLowerCase().includes(rolePrefix);
      const bIsRoleSpecific = b.questionId.toLowerCase().includes(rolePrefix);
      
      if (aIsRoleSpecific && !bIsRoleSpecific) return -1;
      if (!aIsRoleSpecific && bIsRoleSpecific) return 1;
      return 0;
    });
    
    const topRecommendations = recommendations.slice(0, 5);
    
    console.log('Final recommendations:', topRecommendations);
    
    const calculatedResults = {
      successRate: finalSuccessRate,
      recommendations: topRecommendations,
      strengths: [...new Set(strengths)], // Remove any duplicates just in case
      weaknesses: [...new Set(weaknesses)] // Remove any duplicates just in case
    };

    setResults(calculatedResults);
    
    console.log('=== RESULTS CALCULATION COMPLETE ===');
    
    // Return the results for external use (like in QuestionBatch)
    return calculatedResults;
  };

  // Reset the assessment to initial state
  const resetAssessment = () => {
    setBiodata({
      fullName: '',
      email: '',
      phone: '',
      ageGroup: '',
    });
    setSelectedRole(null);
    setStage('welcome');
    setCurrentBatch(0);
    setCurrentQuestionSet('general');
    setAnswers({
      general: {},
      roleSpecific: {}
    });
    setResults({
      successRate: 0,
      recommendations: [],
      strengths: [],
      weaknesses: []
    });
  };

  // Get batch progress information
  const getBatchProgress = () => {
    let totalBatches = 4; // 2 general + 2 role-specific
    let completedBatches = 0;
    
    if (stage === 'generalQuestions') {
      completedBatches = currentBatch;
    } else if (stage === 'roleQuestions') {
      completedBatches = 2 + currentBatch;
    } else if (stage === 'results') {
      completedBatches = 4;
    }
    
    return { 
      current: completedBatches + 1,
      total: totalBatches,
      percentage: Math.round(((completedBatches + 1) / totalBatches) * 100)
    };
  };

  // Get role name for display
  const getRoleName = () => {
    const roleNames = {
      networkAdmin: "Network Administration",
      cybersecurity: "Cybersecurity"
    };
    return roleNames[selectedRole] || '';
  };

  // Value object to be provided to context consumers
  const value = {
    biodata,
    updateBiodata,
    selectedRole,
    selectRole,
    stage,
    currentBatch,
    currentQuestionSet,
    answers,
    results,
    nextStage,
    prevStage,
    recordBatchAnswers,
    resetAssessment,
    startAssessment,
    switchRole,
    goBackToRoleSelection,
    getCurrentBatch,
    getBatchProgress,
    getRoleName,
    calculateResults, // ADDED: Now exposed for external use
    // Keep these for backward compatibility with existing components
    getCurrentQuestion: () => {
      // This is mainly for the old QuestionCard component if still used
      const batch = getCurrentBatch();
      return batch[0] || null;
    },
    recordAnswer: (questionId, answer) => {
      // For backward compatibility
      recordBatchAnswers({ [questionId]: answer });
    },
    getProgress: () => {
      // For backward compatibility, but using batch progress
      return getBatchProgress();
    }
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}