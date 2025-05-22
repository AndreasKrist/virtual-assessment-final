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
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-800">Assessment Results</h1>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-blue-600">Loading...</p>
              </div>
            ) : selectedUser ? (
              <div>
                <Button 
                  variant="secondary" 
                  onClick={handleBack}
                  className="mb-6"
                >
                  ← Back to List
                </Button>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-blue-800">User Information</h2>
                  <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800"><span className="font-medium">Name:</span> {selectedUser.fullName}</p>
                    <p className="text-blue-800"><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p className="text-blue-800"><span className="font-medium">Phone:</span> {selectedUser.phone}</p>
                    <p className="text-blue-800"><span className="font-medium">Date:</span> {new Date(selectedUser.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedUser.results && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-blue-800">Assessment Results</h2>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">Role: {selectedUser.results.roleName}</p>
                      <p className="font-medium mt-2 text-blue-800">Success Rate: 
                        <span className={`ml-2 font-bold ${
                          selectedUser.results.successRate >= 90 ? 'text-green-600' :
                          selectedUser.results.successRate >= 75 ? 'text-blue-600' :
                          selectedUser.results.successRate >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {selectedUser.results.successRate}%
                        </span>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 border border-blue-200 rounded-lg bg-white">
                        <h3 className="font-medium mb-2 text-green-600">Strengths</h3>
                        {selectedUser.results.strengths.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {selectedUser.results.strengths.map((strength, i) => (
                              <li key={i} className="capitalize text-blue-700">{strength.replace(/([A-Z])/g, ' $1').trim()}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-blue-500 italic">No strengths identified</p>
                        )}
                      </div>
                      
                      <div className="p-4 border border-blue-200 rounded-lg bg-white">
                        <h3 className="font-medium mb-2 text-blue-600">Areas for Improvement</h3>
                        {selectedUser.results.weaknesses.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {selectedUser.results.weaknesses.map((weakness, i) => (
                              <li key={i} className="capitalize text-blue-700">{weakness.replace(/([A-Z])/g, ' $1').trim()}</li>
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
                        <ul className="list-disc list-inside">
                          {selectedUser.results.recommendations.map((course, i) => (
                            <li key={i} className="text-blue-700">{course}</li>
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
                <div className="flex justify-between items-center mb-6">
                  <p className="text-blue-600 text-lg font-medium">{users.length} user(s) found</p>
                  <Button onClick={handleExport} className="px-6 py-3">Export Data</Button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
                  <div className="overflow-x-auto">
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
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-blue-50 rounded-lg">
                <p className="text-blue-600 text-lg">No saved results found.</p>
                <p className="mt-2 text-sm text-blue-500">
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