import React, { useState } from 'react';
import { useAssessment } from '../../contexts/AssessmentContext';
import Button from '../ui/Button';
import { biodataQuestions } from '../../data/questions';
import { motion } from 'framer-motion';

export default function BiodataForm() {
  const { biodata, updateBiodata, nextStage } = useAssessment();
  const [errors, setErrors] = useState({});
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBiodata({ [name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    biodataQuestions.forEach(question => {
      if (question.required && !biodata[question.id]) {
        newErrors[question.id] = `${question.label} is required`;
        isValid = false;
      }
    });

    // Validate email format if provided
    if (biodata.email && !/\S+@\S+\.\S+/.test(biodata.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStage();
    } else {
      // Scroll to first error
      const firstErrorId = Object.keys(errors)[0];
      if (firstErrorId) {
        document.getElementById(firstErrorId)?.focus();
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const formFieldAnimation = {
    focused: {
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
      borderColor: "#3b82f6",
      scale: 1.01
    },
    error: {
      boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.3)",
      borderColor: "#ef4444",
    },
    normal: {
      boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
      borderColor: "#e5e7eb",
      scale: 1
    }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-8">
        <motion.h2 
          className="text-2xl font-bold mb-8 text-center text-blue-800"
          variants={itemVariants}
        >
          Tell Us About Yourself
        </motion.h2>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          variants={containerVariants}
        >
          {biodataQuestions.map((question, index) => (
            <motion.div 
              key={question.id} 
              className="space-y-1"
              variants={itemVariants}
              custom={index}
            >
              <label 
                htmlFor={question.id} 
                className="block text-sm font-medium text-blue-800"
              >
                {question.label}{question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {question.type === 'select' ? (
                <motion.select
                  id={question.id}
                  name={question.id}
                  value={biodata[question.id] || ''}
                  onChange={handleChange}
                  onFocus={() => setActiveField(question.id)}
                  onBlur={() => setActiveField(null)}
                  animate={
                    activeField === question.id
                      ? "focused"
                      : errors[question.id]
                      ? "error"
                      : "normal"
                  }
                  variants={formFieldAnimation}
                  transition={{ duration: 0.2 }}
                  className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none bg-white ${
                    errors[question.id] 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select an option</option>
                  {question.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </motion.select>
              ) : (
                <motion.input
                  type={question.type}
                  id={question.id}
                  name={question.id}
                  value={biodata[question.id] || ''}
                  onChange={handleChange}
                  onFocus={() => setActiveField(question.id)}
                  onBlur={() => setActiveField(null)}
                  animate={
                    activeField === question.id
                      ? "focused"
                      : errors[question.id]
                      ? "error"
                      : "normal"
                  }
                  variants={formFieldAnimation}
                  transition={{ duration: 0.2 }}
                  className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none ${
                    errors[question.id] 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              )}
              
              <AnimatedError error={errors[question.id]} />
            </motion.div>
          ))}
          
          <motion.div 
            className="flex justify-end pt-4"
            variants={itemVariants}
          >
            <Button 
              type="submit"
              className="px-8 py-3"
            >
              Continue
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}

// Animated error message component
function AnimatedError({ error }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: error ? 1 : 0, 
        height: error ? 'auto' : 0,
        marginTop: error ? '0.5rem' : 0
      }}
      transition={{ duration: 0.2 }}
    >
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </motion.div>
  );
}