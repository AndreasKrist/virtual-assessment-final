import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAssessment } from '../contexts/AssessmentContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

export default function Home() {
  const router = useRouter();
  const { nextStage } = useAssessment();
  
  const handleStartAssessment = () => {
    nextStage();
    router.push('/assessment');
  };

  return (
    <Layout>
      <Head>
        <title>IT Career Assessment</title>
        <meta name="description" content="Discover your potential IT career path and get personalized recommendations." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">IT Career Assessment</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover your potential success rate in IT roles and get personalized course recommendations.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
                  How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ol className="space-y-4">
                      <li className="flex">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-600 dark:text-blue-300 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">
                          1
                        </div>
                        <div>
                          <h3 className="font-medium">Choose Your Career Interest</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Select between Network Administration or Cybersecurity
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-600 dark:text-blue-300 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">
                          2
                        </div>
                        <div>
                          <h3 className="font-medium">Answer Simple Questions</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Answer yes/no questions about your current knowledge
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                  <div>
                    <ol className="space-y-4" start="3">
                      <li className="flex">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-600 dark:text-blue-300 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">
                          3
                        </div>
                        <div>
                          <h3 className="font-medium">Get Your Success Rate</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            See your estimated success rate in your chosen path
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-600 dark:text-blue-300 flex items-center justify-center font-medium text-sm mr-3 mt-0.5">
                          4
                        </div>
                        <div>
                          <h3 className="font-medium">Receive Course Recommendations</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Get personalized course suggestions to improve your skills
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                    <path d="M6 10v4"></path>
                    <path d="M12 10v4"></path>
                    <path d="M18 10v4"></path>
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Network Administration</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Set up, maintain, and troubleshoot network systems to keep organizations connected.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      Network Configuration
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      Troubleshooting
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      System Maintenance
                    </span>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Cybersecurity</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Protect systems and data from digital attacks and security threats.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      Threat Detection
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      Security Protocols
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      Risk Assessment
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  size="large"
                  onClick={handleStartAssessment}
                >
                  Start Your Assessment
                </Button>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Takes only 5-10 minutes to complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}