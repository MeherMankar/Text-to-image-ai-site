import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor for logging and modifying requests
apiClient.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling common errors
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error: Cannot connect to the server');
      return Promise.reject(new Error('Cannot connect to the server. Please check your internet connection or try again later.'));
    }
    
    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 400:
        console.error('Bad Request:', error.response.data);
        
        // Check for OpenAI billing error
        if (error.response.data.details?.error?.code === 'billing_hard_limit_reached') {
          return Promise.reject(new Error('OpenAI billing limit reached. Please check your OpenAI account and add credits.'));
        }
        
        return Promise.reject(new Error(error.response.data.error || 'Invalid request'));
      
      case 401:
        console.error('Unauthorized:', error.response.data);
        return Promise.reject(new Error('Unauthorized access. Please check your API keys.'));
      
      case 403:
        console.error('Forbidden:', error.response.data);
        return Promise.reject(new Error('You do not have permission to access this resource.'));
      
      case 404:
        console.error('Not Found:', error.response.data);
        return Promise.reject(new Error('The requested resource was not found.'));
      
      case 500:
        console.error('Server Error:', error.response.data);
        
        // Check for billing limit error in the error message
        if (error.response.data.error && error.response.data.error.includes('billing limit')) {
          return Promise.reject(new Error('OpenAI billing limit reached. Please check your OpenAI account and add credits.'));
        }
        
        return Promise.reject(new Error('An error occurred on the server. Please try again later.'));
      
      default:
        console.error(`HTTP Error ${error.response.status}:`, error.response.data);
        return Promise.reject(new Error('An unexpected error occurred. Please try again later.'));
    }
  }
);

// API service functions
const apiService = {
  // Get available models
  getModels: async () => {
    try {
      const response = await apiClient.get('/api/models');
      return response.data.models || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      // If this is already an Error object, pass it through
      if (error instanceof Error) {
        throw error;
      }
      // Otherwise create a proper Error object
      throw new Error('Failed to fetch available models');
    }
  },
  
  // Generate image from text
  generateImage: async (prompt, model = 'stable-diffusion') => {
    try {
      const response = await apiClient.post('/api/generate', { prompt, model });
      return response.data;
    } catch (error) {
      // If this is already an Error object, pass it through
      if (error instanceof Error) {
        throw error;
      }
      // Otherwise create a proper Error object
      throw new Error('Failed to generate image. Please try again.');
    }
  },
  
  // Health check to test connection
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      // If this is already an Error object, pass it through
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to connect to the server. Please check your connection.');
    }
  }
};

export default apiService; 