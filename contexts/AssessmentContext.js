import React, { createContext, useContext, useState } from 'react';
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
  const [stage, setStage] = useState('welcome'); // welcome, biodata, roleSelection, generalQuestions, roleQuestions, results

  // Current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  // Set biodata information
  const updateBiodata = (data) => {
    setBiodata({ ...biodata, ...data });
  };

  // Select role
  const selectRole = (role) => {
    setSelectedRole(role);
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
        setCurrentQuestionIndex(0);
        break;
      case 'generalQuestions':
        if (currentQuestionIndex < generalQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setStage('roleQuestions');
          setCurrentQuestionSet('roleSpecific');
          setCurrentQuestionIndex(0);
        }
        break;
      case 'roleQuestions':
        const roleQuestionsArray = roleQuestions[selectedRole];
        if (currentQuestionIndex < roleQuestionsArray.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          calculateResults();
          setStage('results');
        }
        break;
      default:
        break;
    }
  };

  // Go back to previous stage or question
  const prevStage = () => {
    switch (stage) {
      case 'biodata':
        setStage('welcome');
        break;
      case 'roleSelection':
        setStage('biodata');
        break;
      case 'generalQuestions':
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
          setStage('roleSelection');
        }
        break;
      case 'roleQuestions':
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
          setStage('generalQuestions');
          setCurrentQuestionSet('general');
          setCurrentQuestionIndex(generalQuestions.length - 1);
        }
        break;
      default:
        break;
    }
  };

  // Record an answer
  const recordAnswer = (questionId, answer) => {
    if (currentQuestionSet === 'general') {
      setAnswers({
        ...answers,
        general: {
          ...answers.general,
          [questionId]: answer
        }
      });
    } else {
      setAnswers({
        ...answers,
        roleSpecific: {
          ...answers.roleSpecific,
          [questionId]: answer
        }
      });
    }
  };

  // Calculate assessment results
  const calculateResults = () => {
    // Count 'yes' answers
    const generalYesCount = Object.values(answers.general).filter(answer => answer === true).length;
    const roleYesCount = Object.values(answers.roleSpecific).filter(answer => answer === true).length;
    
    // Calculate success rate
    // Formula: If they answer 5/10 correctly: ~75% success rate
    // If they answer 8/10 correctly: ~90% success rate
    const generalWeight = 0.4; // General questions are 40% of the score
    const roleWeight = 0.6;    // Role questions are 60% of the score
    
    const generalScore = generalYesCount / generalQuestions.length;
    const roleScore = roleYesCount / roleQuestions[selectedRole].length;
    
    // Apply curve to the scores (this makes 5/10 = 75% and 8/10 = 90%)
    const curveScore = (score) => {
      if (score <= 0.5) {
        return score * 1.5; // 5/10 = 0.5 → 0.75 (75%)
      } else {
        // Linear interpolation between (0.5, 0.75) and (0.8, 0.9)
        return 0.75 + (score - 0.5) * (0.15 / 0.3);
      }
    };
    
    const curvedGeneralScore = curveScore(generalScore);
    const curvedRoleScore = curveScore(roleScore);
    
    const weightedScore = (curvedGeneralScore * generalWeight) + (curvedRoleScore * roleWeight);
    const finalSuccessRate = Math.round(weightedScore * 100);
    
    // Identify strengths and weaknesses
    const strengths = [];
    const weaknesses = [];
    
    // Get course recommendations based on 'no' answers
    const recommendations = [];
    
    // Check general questions
    generalQuestions.forEach(question => {
      const answered = answers.general[question.id];
      if (answered === true) {
        strengths.push(question.category);
      } else if (answered === false) {
        weaknesses.push(question.category);
        recommendations.push({
          questionId: question.id,
          questionText: question.text,
          courseName: question.courseRecommendation,
          courseDetails: courseCatalog[question.courseRecommendation] || null
        });
      }
    });
    
    // Check role-specific questions
    roleQuestions[selectedRole].forEach(question => {
      const answered = answers.roleSpecific[question.id];
      if (answered === true) {
        strengths.push(question.category);
      } else if (answered === false) {
        weaknesses.push(question.category);
        recommendations.push({
          questionId: question.id,
          questionText: question.text,
          courseName: question.courseRecommendation,
          courseDetails: courseCatalog[question.courseRecommendation] || null
        });
      }
    });
    
    // Sort recommendations by priority (start with role-specific ones)
    recommendations.sort((a, b) => {
      // Role-specific recommendations come first
      const aIsRoleSpecific = a.questionId.includes(selectedRole === 'networkAdmin' ? 'network' : 'cyber');
      const bIsRoleSpecific = b.questionId.includes(selectedRole === 'networkAdmin' ? 'network' : 'cyber');
      
      if (aIsRoleSpecific && !bIsRoleSpecific) return -1;
      if (!aIsRoleSpecific && bIsRoleSpecific) return 1;
      return 0;
    });
    
    // Limit to top 5 recommendations
    const topRecommendations = recommendations.slice(0, 5);
    
    // Update results
    setResults({
      successRate: finalSuccessRate,
      recommendations: topRecommendations,
      strengths: [...new Set(strengths)], // Remove duplicates
      weaknesses: [...new Set(weaknesses)] // Remove duplicates
    });
  };

  // Reset the assessment
  const resetAssessment = () => {
    setBiodata({
      fullName: '',
      email: '',
      phone: '',
      ageGroup: '',
    });
    setSelectedRole(null);
    setStage('welcome');
    setCurrentQuestionIndex(0);
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

  // Value object to be provided to context consumers
  const value = {
    biodata,
    updateBiodata,
    selectedRole,
    selectRole,
    stage,
    currentQuestionIndex,
    currentQuestionSet,
    answers,
    results,
    nextStage,
    prevStage,
    recordAnswer,
    resetAssessment,
    getCurrentQuestion: () => {
      if (currentQuestionSet === 'general') {
        return generalQuestions[currentQuestionIndex];
      } else {
        return roleQuestions[selectedRole][currentQuestionIndex];
      }
    },
    getProgress: () => {
      let totalQuestions = generalQuestions.length;
      if (selectedRole) {
        totalQuestions += roleQuestions[selectedRole].length;
      }
      
      let completedQuestions = 0;
      if (stage === 'generalQuestions') {
        completedQuestions = currentQuestionIndex;
      } else if (stage === 'roleQuestions') {
        completedQuestions = generalQuestions.length + currentQuestionIndex;
      } else if (stage === 'results') {
        completedQuestions = totalQuestions;
      }
      
      return { 
        current: completedQuestions,
        total: totalQuestions,
        percentage: Math.round((completedQuestions / totalQuestions) * 100)
      };
    }
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}