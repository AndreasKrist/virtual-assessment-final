// lib/googleSheets.js
export async function saveToGoogleSheet(userData) {
  try {
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