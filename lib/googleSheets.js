/**
 * Saves user data to a Google Sheet using Google Apps Script with JSONP
 * This approach avoids CORS issues when calling Google Apps Script
 */
require('dotenv').config();

export async function saveToGoogleSheet(userData) {
  try {
    // ⚠️ Replace with your actual Web App URL from Google Apps Script deployment
    const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL;;
    
    // Format the assessment results
    const resultsForSheet = {
      fullName: userData.fullName || 'Not provided',
      email: userData.email || 'Not provided',
      phone: userData.phone || 'Not provided',
      ageGroup: userData.ageGroup || 'Not provided',
      roleName: userData.results?.roleName || 'N/A',
      successRate: userData.results?.successRate || 'N/A',
      strengths: (userData.results?.strengths || []).join(', '),
      weaknesses: (userData.results?.weaknesses || []).join(', '),
      recommendations: (userData.results?.recommendations?.map(rec => 
        typeof rec === 'string' ? rec : rec.courseName
      ) || []).join(', ')
    };
    
    console.log('Sending data to Google Sheets:', resultsForSheet);
    
    // Create a JSONP request (avoids CORS issues)
    return new Promise((resolve, reject) => {
      // Create a unique callback name
      const callbackName = 'googleSheetsCallback_' + Math.round(Math.random() * 1000000);
      
      // Create a timeout to handle failed requests
      const timeoutId = setTimeout(() => {
        // Clean up if it times out
        document.body.removeChild(script);
        delete window[callbackName];
        reject(new Error('Request to Google Sheets timed out'));
      }, 10000); // 10 seconds timeout
      
      // Create global callback function
      window[callbackName] = function(response) {
        // Clear the timeout
        clearTimeout(timeoutId);
        
        // Clean up
        document.body.removeChild(script);
        delete window[callbackName];
        
        if (response && response.success) {
          resolve({ success: true, message: 'Data saved to Google Sheets successfully' });
        } else {
          reject(new Error(response?.message || 'Failed to save to Google Sheets'));
        }
      };
      
      // Prepare data for URL parameters
      const dataParam = encodeURIComponent(JSON.stringify(resultsForSheet));
      
      // Create script tag for JSONP request
      const script = document.createElement('script');
      script.src = `${WEBAPP_URL}?data=${dataParam}&callback=${callbackName}`;
      
      // Append to document to start the request
      document.body.appendChild(script);
    });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return { success: false, message: 'Error saving to Google Sheets: ' + error.message };
  }
}