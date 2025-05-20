/**
 * Saves user data to a specified storage mechanism
 * Currently uses localStorage for demonstration, but can be updated
 * to use a database, API, or other storage solution
 */
export async function saveUserData(userData, assessmentResults = null) {
  // Extract the required fields
  const { fullName, email, phone } = userData;
  
  // Create a data object with these fields
  const dataToSave = {
    fullName,
    email,
    phone: phone || 'Not provided',
    timestamp: new Date().toISOString(),
    results: assessmentResults
  };
  
  // For demonstration, we'll save to localStorage
  // In a real application, you would send this to your API/database
  try {
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const savedUsers = JSON.parse(localStorage.getItem('assessmentUsers') || '[]');
      savedUsers.push(dataToSave);
      localStorage.setItem('assessmentUsers', JSON.stringify(savedUsers));
    }
    
    console.log('User data saved successfully:', dataToSave);
    return { success: true, message: 'Data saved successfully' };
  } catch (error) {
    console.error('Error saving user data:', error);
    return { success: false, message: 'Error saving data' };
  }
}

/**
 * Retrieves all saved user data
 */
export function getSavedUsers() {
  try {
    if (typeof window !== 'undefined') {
      const savedUsers = JSON.parse(localStorage.getItem('assessmentUsers') || '[]');
      return savedUsers;
    }
    return [];
  } catch (error) {
    console.error('Error retrieving saved users:', error);
    return [];
  }
}