require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

// Import our custom modules
const modelConfig = require('./config/models');
const apiHandler = require('./utils/apiHandler');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy settings (IMPORTANT fix for Render and Cloudflare)
// This enables proper rate limiting when behind a proxy
app.set('trust proxy', true);

// Enhanced logging for debugging
const logRequests = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
};

// Add detailed logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(logRequests);
}

// Enhanced CORS configuration to allow requests from any frontend
app.use(cors({
  // In production, you might want to restrict this to specific domains
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware
app.use(helmet({
  // Disable contentSecurityPolicy for simplicity in this demo app
  contentSecurityPolicy: false,
  // Allow cross-origin requests
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'unsafe-none' }
})); 
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Test endpoint to verify CORS
app.get('/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working correctly!',
    origin: req.headers.origin || 'Unknown origin',
    timestamp: new Date().toISOString()
  });
});

// Get available models endpoint
app.get('/api/models', (req, res) => {
  const models = modelConfig.getAvailableModels();
  res.json({ models });
});

// API key verification endpoint
app.get('/api/verify-keys', (req, res) => {
  // Get all providers
  const providers = Object.keys(modelConfig.providers);
  
  // Check each provider's API key
  const result = {};
  
  providers.forEach(providerId => {
    const provider = modelConfig.getProviderConfig(providerId);
    if (provider.apiKey) {
      const apiKey = process.env[provider.apiKey];
      result[`${providerId}KeyPresent`] = !!apiKey;
      result[`${providerId}KeyLength`] = apiKey ? apiKey.length : 0;
      result[`${providerId}Enabled`] = process.env[provider.enabled] !== 'false';
    }
  });
  
  // Add environment info
  result.environment = process.env.NODE_ENV || 'development';
  
  res.json(result);
});

// Test endpoints for each provider
app.get('/api/test-provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    
    // Check if provider exists
    const provider = modelConfig.getProviderConfig(providerId);
    if (!provider) {
      return res.status(400).json({ 
        error: `Invalid provider: ${providerId}`, 
        details: 'Provider not found in configuration'
      });
    }
    
    // Test the provider connection
    const result = await apiHandler.testProviderConnection(providerId);
    res.json(result);
  } catch (error) {
    console.error(`Error testing provider:`, error.message);
    res.status(500).json({
      error: `Failed to connect to provider API`,
      message: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Text-to-Image Generator API is running');
});

// API endpoint for text-to-image generation with improved error handling
app.post('/api/generate', async (req, res) => {
  try {
    console.log('Generate image request received:', req.body);
    
    const { prompt, model = 'stable-diffusion-xl' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get all available models
    const availableModels = modelConfig.getAvailableModels();
    
    // Check if the requested model exists and is enabled
    const selectedModel = availableModels.find(m => m.id === model);
    if (!selectedModel) {
      return res.status(400).json({ error: 'Invalid model specified' });
    }
    
    if (!selectedModel.enabled) {
      return res.status(400).json({ 
        error: `The model ${model} is currently disabled`,
        fix: `Enable it by setting ${selectedModel.providerConfig?.enabled}=true in your environment variables`
      });
    }
    
    if (selectedModel.requires_key && !selectedModel.available) {
      return res.status(400).json({ 
        error: `${selectedModel.name} API key is missing`,
        fix: `Add ${selectedModel.providerConfig?.apiKey} to your environment variables`
      });
    }

    // Generate the image using our API handler
    const imageUrl = await apiHandler.generateImage(model, prompt);
    
    console.log('Sending successful response with image URL');
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error generating image:');
    console.error('Status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Error message:', error.message);
    
    // More helpful error message based on the specific error
    let errorMessage = 'Failed to generate image';
    let errorDetails = error.response?.data || error.message;
    
    // Handle common API errors
    if (error.response?.status === 401) {
      errorMessage = 'Authentication failed. Check your API key.';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access forbidden. Your API key may not have the required permissions.';
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      errorMessage = 'Could not connect to the API service.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. The server took too long to respond.';
    }
    
    // Handle OpenAI billing error specifically
    if (error.response?.data?.error?.code === 'billing_hard_limit_reached') {
      errorMessage = 'OpenAI billing limit reached. Please check your OpenAI account and add credits.';
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails,
      status: error.response?.status || 'unknown'
    });
  }
});

// CORS preflight requests handling
app.options('*', cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Log available providers and their status
  console.log('API providers status:');
  
  Object.entries(modelConfig.providers).forEach(([providerId, provider]) => {
    const apiKey = provider.apiKey ? process.env[provider.apiKey] : null;
    const isEnabled = provider.enabled ? (process.env[provider.enabled] !== 'false') : true;
    
    console.log(`- ${provider.name}: ${apiKey ? 'API Key ✓' : 'No API Key'} (Enabled: ${isEnabled ? '✓' : '✗'})`);
    
    // Log models for this provider
    provider.models.forEach(model => {
      console.log(`  - ${model.name}`);
    });
  });
}); 