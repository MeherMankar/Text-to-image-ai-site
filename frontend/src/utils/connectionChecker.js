/**
 * Utility for checking backend connection status
 */

// Simple function to check if a URL is reachable
export const isUrlReachable = async (url) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'GET',
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('URL reachability check failed:', error);
    return false;
  }
};

// Function to diagnose connection issues
export const diagnoseConnectionIssue = async () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const diagnosis = {
    apiUrl,
    isReachable: false,
    possibleIssues: [],
    recommendations: []
  };
  
  // Check if the URL is reachable
  diagnosis.isReachable = await isUrlReachable(apiUrl);
  
  if (!diagnosis.isReachable) {
    // Check if it's a CORS issue by trying a no-cors request
    try {
      // We don't need to use the response, just checking if the request doesn't throw
      await fetch(apiUrl, { mode: 'no-cors' });
      // If we get here, the server might be reachable but has CORS issues
      diagnosis.possibleIssues.push('CORS configuration');
      diagnosis.recommendations.push('The backend server may be running but has CORS issues. Check the CORS configuration in your backend server.');
    } catch (error) {
      // If this also fails, the server is likely not running or unreachable
      diagnosis.possibleIssues.push('Server unavailable');
      diagnosis.recommendations.push('The backend server appears to be offline or unreachable. Make sure it\'s running and accessible.');
    }
    
    // Check if the URL is correctly formatted
    try {
      new URL(apiUrl);
    } catch (error) {
      diagnosis.possibleIssues.push('Invalid URL format');
      diagnosis.recommendations.push(`The API URL "${apiUrl}" is not properly formatted. Check your .env file.`);
    }
    
    // Check if using localhost but deployed
    if (apiUrl.includes('localhost') && window.location.hostname !== 'localhost') {
      diagnosis.possibleIssues.push('Using localhost in production');
      diagnosis.recommendations.push('You are using a localhost URL in a deployed environment. Update your REACT_APP_API_URL to point to your deployed backend.');
    }
    
    // Add general recommendations
    diagnosis.recommendations.push('Make sure your backend is deployed and running.');
    diagnosis.recommendations.push('Verify that your REACT_APP_API_URL in .env is correct.');
    diagnosis.recommendations.push('Check that your backend allows CORS requests from your frontend domain.');
  }
  
  return diagnosis;
};

// Create a named object before exporting as default
const connectionChecker = {
  isUrlReachable,
  diagnoseConnectionIssue
};

export default connectionChecker; 