// lib/googleSheets.js - UPDATED with Consultant field
export async function saveToGoogleSheet(userData) {
  try {
    // Helper function to safely convert arrays to strings
    const arrayToString = (value) => {
      if (Array.isArray(value)) {
        return value.join(', ');
      } else if (typeof value === 'string') {
        return value;
      } else {
        return '';
      }
    };
    
    // Format the assessment results - UPDATED with consultant field
    const resultsForSheet = {
      fullName: userData.fullName || 'Not provided',
      email: userData.email || 'Not provided',
      phone: userData.phone || 'Not provided',
      ageGroup: userData.ageGroup || 'Not provided',
      consultant: userData.consultant || 'Not provided', // NEW: Consultant field
      roleName: userData.results?.roleName || 'N/A',
      successRate: userData.results?.successRate || 'N/A',
      strengths: arrayToString(userData.results?.strengths || []),
      weaknesses: arrayToString(userData.results?.weaknesses || []),
      recommendations: arrayToString(userData.results?.recommendations?.map(rec => 
        typeof rec === 'string' ? rec : rec.courseName
      ) || [])
    };
    
    console.log('Sending data to Google Sheets:', resultsForSheet);
    
    // Call our secure API route instead of directly calling Google
    const response = await fetch('/api/save-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultsForSheet),
    });
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true, message: 'Data saved to Google Sheets successfully' };
    } else {
      throw new Error(result.message || 'Failed to save to Google Sheets');
    }
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return { success: false, message: 'Error saving to Google Sheets: ' + error.message };
  }
}