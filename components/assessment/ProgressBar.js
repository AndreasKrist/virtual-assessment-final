import React from 'react';

export default function ProgressBar({ current, total, className = '' }) {
  const percentage = Math.round((current / total) * 100) || 0;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-blue-700 font-medium">Question {current} of {total}</span>
        <span className="text-blue-700 font-medium">{percentage}% Complete</span>
      </div>
      <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}