// /pages/api/save-results.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    const userData = req.body;
    
    // Get the Google Apps Script URL from environment variables
    const WEBAPP_URL = process.env.WEBAPP_URL;
    
    // Check if the environment variable is defined
    if (!WEBAPP_URL) {
      console.error('WEBAPP_URL environment variable is not defined');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error: WEBAPP_URL not defined' 
      });
    }

    console.log('Making request to Google Apps Script:', WEBAPP_URL);
    
    // Use a unique callback name for JSONP
    const callbackName = 'googleSheetsCallback_' + Math.round(Math.random() * 1000000);
    const fullUrl = `${WEBAPP_URL}?data=${encodeURIComponent(JSON.stringify(userData))}&callback=${callbackName}`;
    
    // For debugging:
    console.log('Full URL being called:', fullUrl);
    
    // Make the request to Google Apps Script
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Apps Script error:', errorText);
      return res.status(500).json({ 
        success: false, 
        message: `Google Apps Script error: ${response.status} ${response.statusText}` 
      });
    }
    
    const responseText = await response.text();
    console.log('Response from Google Apps Script:', responseText);
    
    // Extract the JSON from the JSONP response
    // JSONP responses look like: callbackName({...json data...})
    let jsonData;
    try {
      // This is a very simple JSONP parser
      const jsonString = responseText.substring(
        responseText.indexOf('(') + 1, 
        responseText.lastIndexOf(')')
      );
      jsonData = JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing JSONP response:', e);
      console.log('Raw response:', responseText);
      jsonData = { success: false, message: 'Error parsing response from Google Apps Script' };
    }
    
    return res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error in API route:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + (error.message || 'Unknown error') 
    });
  }
}