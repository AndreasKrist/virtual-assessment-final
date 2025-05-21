import React from 'react';
import { useAssessment } from '../../contexts/AssessmentContext';
import Button from '../ui/Button';

export default function RoleSelection() {
  const { selectRole, nextStage, selectedRole } = useAssessment();
  
  const roles = [
    {
      id: 'networkAdmin',
      title: 'Network Administrator',
      description: 'Manage and maintain computer networks, ensuring they function efficiently and securely.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
          <path d="M6 10v4"></path>
          <path d="M12 10v4"></path>
          <path d="M18 10v4"></path>
        </svg>
      ),
      skills: ['Network configuration', 'Troubleshooting', 'Hardware management', 'User support']
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Protect systems, networks, and data from digital attacks and unauthorized access.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      skills: ['Threat detection', 'Security protocols', 'Risk assessment', 'Incident response']
    }
  ];

  const handleSelectRole = (roleId) => {
    selectRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      nextStage();
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200">
      <div className="p-10">
        <h2 className="text-3xl font-bold mb-3 text-center text-blue-800">Choose Your Area of Discipline</h2>
        <p className="text-blue-700 text-center mb-10 text-lg">
          Select the area you want to pursue.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role) => (
            <div 
              key={role.id}
              className={`border rounded-xl p-8 cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedRole === role.id 
                  ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' 
                  : 'border-blue-200 hover:border-blue-300'
              }`}
              onClick={() => handleSelectRole(role.id)}
            >
              <div className="flex flex-col items-center text-center mb-6">
                {role.icon}
                <h3 className="text-2xl font-semibold text-blue-800">{role.title}</h3>
              </div>
              
              <p className="text-blue-700 mb-6 text-center text-lg">
                {role.description}
              </p>
              
              <div className="mt-6">
                <p className="text-sm font-medium text-blue-700 mb-3">Key skills:</p>
                <div className="flex flex-wrap gap-2">
                  {role.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-block px-3 py-1.5 text-sm bg-blue-100 text-blue-600 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-10">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole}
            size="large"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}