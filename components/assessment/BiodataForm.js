import React, { useState } from 'react';
import { useAssessment } from '../../contexts/AssessmentContext';
import Button from '../ui/Button';
import { biodataQuestions } from '../../data/questions';

export default function BiodataForm() {
  const { biodata, updateBiodata, nextStage } = useAssessment();
  const [errors, setErrors] = useState({});

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
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Tell Us About Yourself</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {biodataQuestions.map((question) => (
            <div key={question.id} className="space-y-1">
              <label 
                htmlFor={question.id} 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {question.label}{question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {question.type === 'select' ? (
                <select
                  id={question.id}
                  name={question.id}
                  value={biodata[question.id] || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors[question.id] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Select an option</option>
                  {question.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={question.type}
                  id={question.id}
                  name={question.id}
                  value={biodata[question.id] || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors[question.id] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                />
              )}
              
              {errors[question.id] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors[question.id]}
                </p>
              )}
            </div>
          ))}
          
          <div className="flex justify-end pt-4">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </div>
    </div>
  );
}