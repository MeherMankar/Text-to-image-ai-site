/**
 * AI Model Configuration
 * 
 * This file contains the configuration for all supported AI models.
 * To add a new model, simply add a new entry to the appropriate provider.
 */

// Get environment variables
const getEnv = (key, defaultValue = null) => process.env[key] || defaultValue;

// Model providers configuration
const providers = {
  stability: {
    name: 'Stability AI',
    apiKey: 'STABILITY_API_KEY',
    enabled: 'ENABLE_STABILITY_AI',
    free: false,
    baseUrl: 'https://api.stability.ai/v1',
    testEndpoint: '/engines/list',
    models: [
      {
        id: 'stable-diffusion-xl',
        name: 'Stable Diffusion XL',
        apiPath: '/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        description: 'High-quality image generation with paid API credits'
      },
      {
        id: 'stable-diffusion-v1-5',
        name: 'Stable Diffusion 1.5',
        apiPath: '/generation/stable-diffusion-v1-5/text-to-image',
        description: 'Classic stable diffusion model, more efficient than XL'
      }
    ]
  },
  
  openai: {
    name: 'OpenAI',
    apiKey: 'OPENAI_API_KEY',
    enabled: 'ENABLE_OPENAI',
    free: false,
    baseUrl: 'https://api.openai.com/v1',
    testEndpoint: '/models',
    models: [
      {
        id: 'dalle',
        name: 'DALL-E 3',
        apiPath: '/images/generations',
        description: 'Requires an active OpenAI API key with sufficient credits'
      }
    ]
  },
  
  huggingface: {
    name: 'Hugging Face',
    apiKey: 'HUGGINGFACE_API_KEY',
    enabled: 'ENABLE_HUGGINGFACE',
    free: true,
    baseUrl: 'https://api-inference.huggingface.co',
    testEndpoint: '/status/runwayml/stable-diffusion-v1-5',
    models: [
      {
        id: 'huggingface-sdxl',
        name: 'Stable Diffusion XL',
        apiPath: '/models/stabilityai/stable-diffusion-xl-base-1.0',
        description: 'Can take longer to generate images. Be patient'
      },
      {
        id: 'huggingface-sd-v1-5',
        name: 'Stable Diffusion 1.5',
        apiPath: '/models/runwayml/stable-diffusion-v1-5',
        description: 'Faster than SDXL but lower quality'
      }
    ]
  },
  
  replicate: {
    name: 'Replicate',
    apiKey: 'REPLICATE_API_KEY',
    enabled: 'ENABLE_REPLICATE',
    free: true,
    baseUrl: 'https://api.replicate.com/v1',
    testEndpoint: '/models/stability-ai/sdxl',
    models: [
      {
        id: 'replicate-sdxl',
        name: 'Stable Diffusion XL',
        apiPath: '/predictions',
        modelVersion: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        description: 'Offers several free generations per day with an API key'
      },
      {
        id: 'replicate-kandinsky',
        name: 'Kandinsky',
        apiPath: '/predictions',
        modelVersion: 'kandinsky-community/kandinsky-2-1:c24380226594a6c96edd96a4c3a1add195cac8bf72dc6516d7b4165fcde5918c',
        description: 'Alternative to Stable Diffusion with different style'
      }
    ]
  },
  
  deepinfra: {
    name: 'DeepInfra',
    apiKey: 'DEEPINFRA_API_KEY',
    enabled: 'ENABLE_DEEPINFRA',
    free: true,
    baseUrl: 'https://api.deepinfra.com/v1',
    testEndpoint: '/models/stability-ai/stable-diffusion-xl-1.0',
    models: [
      {
        id: 'deepinfra-sdxl',
        name: 'Stable Diffusion XL',
        apiPath: '/inference/stability-ai/stable-diffusion-xl-1.0',
        description: 'Free credits for API usage. Results are fast and high quality'
      },
      {
        id: 'deepinfra-sd-v1-5',
        name: 'Stable Diffusion 1.5',
        apiPath: '/inference/stability-ai/stable-diffusion-1-5',
        description: 'Faster than SDXL with good quality results'
      }
    ]
  },
  
  craiyon: {
    name: 'Craiyon',
    apiKey: null, // No API key required
    enabled: 'ENABLE_CRAIYON',
    free: true,
    baseUrl: 'https://api.craiyon.com',
    testEndpoint: null, // No test endpoint needed
    models: [
      {
        id: 'craiyon',
        name: 'Craiyon (Always Free)',
        apiPath: '/v3',
        description: 'No API key required! Completely free service, but may be slower'
      }
    ]
  }
};

/**
 * Get all available models based on environment configuration
 * @returns {Array} Array of model objects with availability and enabled status
 */
function getAvailableModels() {
  const models = [];
  
  // Process each provider
  Object.entries(providers).forEach(([providerId, provider]) => {
    const apiKeyEnv = provider.apiKey;
    const enabledEnv = provider.enabled;
    
    // Check if provider is enabled
    const isEnabled = apiKeyEnv ? 
      (getEnv(enabledEnv) !== 'false') : 
      (getEnv(enabledEnv) !== 'false');
    
    // Check if API key is available (always true for providers without API key)
    const hasApiKey = apiKeyEnv ? !!getEnv(apiKeyEnv) : true;
    
    // Add each model from this provider
    provider.models.forEach(model => {
      models.push({
        id: model.id,
        name: `${provider.name} (${model.name})`,
        available: hasApiKey,
        enabled: isEnabled,
        requires_key: !!apiKeyEnv,
        free: provider.free,
        provider: providerId,
        description: model.description,
        apiPath: model.apiPath,
        modelVersion: model.modelVersion,
        providerConfig: {
          apiKey: provider.apiKey,
          enabled: provider.enabled
        }
      });
    });
  });
  
  return models;
}

/**
 * Get provider configuration by ID
 * @param {string} providerId - The provider ID
 * @returns {Object} Provider configuration
 */
function getProviderConfig(providerId) {
  return providers[providerId] || null;
}

/**
 * Get model configuration by ID
 * @param {string} modelId - The model ID
 * @returns {Object} Combined model and provider configuration
 */
function getModelConfig(modelId) {
  for (const [providerId, provider] of Object.entries(providers)) {
    const model = provider.models.find(m => m.id === modelId);
    if (model) {
      return {
        ...model,
        provider: providerId,
        providerConfig: provider
      };
    }
  }
  return null;
}

/**
 * Get API key for a provider
 * @param {string} providerId - The provider ID
 * @returns {string|null} API key or null if not available
 */
function getApiKey(providerId) {
  const provider = providers[providerId];
  if (!provider || !provider.apiKey) return null;
  return getEnv(provider.apiKey);
}

module.exports = {
  providers,
  getAvailableModels,
  getProviderConfig,
  getModelConfig,
  getApiKey
}; 