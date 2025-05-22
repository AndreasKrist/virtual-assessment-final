import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { getSavedUsers } from '../lib/saveUserData';
import Button from '../components/ui/Button';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    // Load saved users when the component mounts
    const loadUsers = () => {
      setLoading(true);
      const savedUsers = getSavedUsers();
      setUsers(savedUsers);
      setLoading(false);
    };
    
    loadUsers();
  }, []);
  
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };
  
  const handleBack = () => {
    setSelectedUser(null);
  };
  
  const handleExport = () => {
    // Create a JSON string of all user data
    const dataStr = JSON.stringify(users, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assessment_results.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Layout>
      <Head>
        <title>Admin | IT Career Assessment</title>
        <meta name="description" content="Admin panel for IT Career Assessment" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
          <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-800">Assessment Results</h1>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-blue-600">Loading...</p>
              </div>
            ) : selectedUser ? (
              <div>
                <Button 
                  variant="secondary" 
                  onClick={handleBack}
                  className="mb-6 w-full sm:w-auto"
                >
                  ← Back to List
                </Button>
                
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-800">User Information</h2>
                  <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-medium text-blue-800 w-full sm:w-20">Name:</span>
                      <span className="text-blue-700">{selectedUser.fullName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-medium text-blue-800 w-full sm:w-20">Email:</span>
                      <span className="text-blue-700 break-all">{selectedUser.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-medium text-blue-800 w-full sm:w-20">Phone:</span>
                      <span className="text-blue-700">{selectedUser.phone}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-medium text-blue-800 w-full sm:w-20">Date:</span>
                      <span className="text-blue-700">{new Date(selectedUser.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {selectedUser.results && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-800">Assessment Results</h2>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                        <span className="font-medium text-blue-800 w-full sm:w-24">Role:</span>
                        <span className="text-blue-700">{selectedUser.results.roleName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium text-blue-800 w-full sm:w-24">Success Rate:</span>
                        <span className={`font-bold text-lg ${
                          selectedUser.results.successRate >= 90 ? 'text-green-600' :
                          selectedUser.results.successRate >= 75 ? 'text-blue-600' :
                          selectedUser.results.successRate >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {selectedUser.results.successRate}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 border border-blue-200 rounded-lg bg-white">
                        <h3 className="font-medium mb-2 text-green-600">Strengths</h3>
                        {selectedUser.results.strengths.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {selectedUser.results.strengths.map((strength, i) => (
                              <li key={i} className="capitalize text-blue-700 text-sm sm:text-base break-words">
                                {strength.replace(/([A-Z])/g, ' $1').trim()}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-blue-500 italic">No strengths identified</p>
                        )}
                      </div>
                      
                      <div className="p-4 border border-blue-200 rounded-lg bg-white">
                        <h3 className="font-medium mb-2 text-blue-600">Areas for Improvement</h3>
                        {selectedUser.results.weaknesses.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {selectedUser.results.weaknesses.map((weakness, i) => (
                              <li key={i} className="capitalize text-blue-700 text-sm sm:text-base break-words">
                                {weakness.replace(/([A-Z])/g, ' $1').trim()}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-blue-500 italic">No areas for improvement identified</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2 text-blue-800">Recommended Courses</h3>
                      {selectedUser.results.recommendations.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {selectedUser.results.recommendations.map((course, i) => (
                            <li key={i} className="text-blue-700 text-sm sm:text-base break-words">{course}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-blue-500 italic">No course recommendations</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : users.length > 0 ? (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <p className="text-blue-600 text-base sm:text-lg font-medium">{users.length} user(s) found</p>
                  <Button onClick={handleExport} className="w-full sm:w-auto px-6 py-3">Export Data</Button>
                </div>
                
                {/* Mobile-optimized table */}
                <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-blue-100">
                        {users.map((user, index) => (
                          <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-blue-800 font-medium">{user.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-blue-700">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-blue-700">{user.results?.roleName || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.results ? (
                                <span className={`font-bold text-lg ${
                                  user.results.successRate >= 90 ? 'text-green-600' :
                                  user.results.successRate >= 75 ? 'text-blue-600' :
                                  user.results.successRate >= 60 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {user.results.successRate}%
                                </span>
                              ) : (
                                <span className="text-blue-500">N/A</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                              {new Date(user.timestamp).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleUserSelect(user)}
                                className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden">
                    {users.map((user, index) => (
                      <div key={index} className="border-b border-blue-100 p-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-blue-800 truncate">{user.fullName}</h3>
                            <p className="text-sm text-blue-600 truncate">{user.email}</p>
                          </div>
                          {user.results && (
                            <span className={`ml-2 font-bold text-lg ${
                              user.results.successRate >= 90 ? 'text-green-600' :
                              user.results.successRate >= 75 ? 'text-blue-600' :
                              user.results.successRate >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {user.results.successRate}%
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-blue-700">
                          <div>
                            <span className="block">{user.results?.roleName || 'N/A'}</span>
                            <span className="text-xs text-blue-500">
                              {new Date(user.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleUserSelect(user)}
                            className="px-3 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors font-medium min-h-[40px]"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-blue-50 rounded-lg">
                <p className="text-blue-600 text-base sm:text-lg">No saved results found.</p>
                <p className="mt-2 text-xs sm:text-sm text-blue-500">
                  Users will appear here after they save their assessment results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}