/**
 * API Handler Utility
 * 
 * This file contains functions for handling API requests to different providers.
 * It abstracts the complexity of different API implementations.
 */

const axios = require('axios');
const modelConfig = require('../config/models');

/**
 * Generate an image using the specified model
 * @param {string} modelId - The model ID
 * @param {string} prompt - The text prompt
 * @returns {Promise<string>} - A promise that resolves to the image URL
 */
async function generateImage(modelId, prompt) {
  // Get the model configuration
  const model = modelConfig.getModelConfig(modelId);
  if (!model) {
    throw new Error(`Invalid model specified: ${modelId}`);
  }
  
  const providerId = model.provider;
  const apiKey = modelConfig.getApiKey(providerId);
  
  // Check if API key is required and available
  if (model.requires_key && !apiKey) {
    throw new Error(`${model.providerConfig.name} API key is missing. Add ${model.providerConfig.apiKey} to your environment variables.`);
  }
  
  console.log(`Using model: ${modelId} from provider: ${providerId}`);
  
  // Call the appropriate provider function
  switch (providerId) {
    case 'stability':
      return generateStabilityImage(model, prompt, apiKey);
    case 'openai':
      return generateOpenAIImage(model, prompt, apiKey);
    case 'huggingface':
      return generateHuggingFaceImage(model, prompt, apiKey);
    case 'replicate':
      return generateReplicateImage(model, prompt, apiKey);
    case 'deepinfra':
      return generateDeepInfraImage(model, prompt, apiKey);
    case 'craiyon':
      return generateCraiyonImage(model, prompt);
    default:
      throw new Error(`Unsupported provider: ${providerId}`);
  }
}

/**
 * Generate image using Stability AI
 */
async function generateStabilityImage(model, prompt, apiKey) {
  console.log(`Using Stability AI API: ${model.name}`);
  
  const apiUrl = `${model.providerConfig.baseUrl}${model.apiPath}`;
  console.log('Calling API at:', apiUrl);
  
  const requestData = {
    text_prompts: [{ text: prompt }],
    cfg_scale: 7,
    height: 1024,
    width: 1024,
    samples: 1,
    steps: 30
  };
  
  console.log('Request data:', JSON.stringify(requestData, null, 2));
  
  const response = await axios({
    method: 'post',
    url: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    data: requestData,
    timeout: 60000 // 60 second timeout
  });
  
  console.log('Stability AI response received');
  
  // Extract image data from response
  const base64Image = response.data.artifacts[0].base64;
  return `data:image/png;base64,${base64Image}`;
}

/**
 * Generate image using OpenAI
 */
async function generateOpenAIImage(model, prompt, apiKey) {
  console.log(`Using OpenAI API: ${model.name}`);
  
  const apiUrl = `${model.providerConfig.baseUrl}${model.apiPath}`;
  console.log('Calling API at:', apiUrl);
  
  // Updated request data for DALL-E 3
  const requestData = {
    model: "dall-e-3", // DALL-E 3 is required as DALL-E 2 is being deprecated
    prompt,
    n: 1,
    size: "1024x1024", // DALL-E 3 supports 1024x1024, 1792x1024, or 1024x1792
    quality: "standard", // "standard" or "hd"
    response_format: "url", // DALL-E 3 supports "url" or "b64_json"
    style: "vivid" // "vivid" or "natural"
  };
  
  console.log('Request data:', JSON.stringify(requestData, null, 2));
  
  // Add timeout to prevent hanging requests
  const response = await axios({
    method: 'post',
    url: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    data: requestData,
    timeout: 60000 // 60 second timeout
  });
  
  console.log('OpenAI DALL-E response received');
  
  // Check if we got the expected data structure
  if (response.data && response.data.data && response.data.data.length > 0 && response.data.data[0].url) {
    return response.data.data[0].url;
  } else {
    console.error('Unexpected OpenAI response structure:', response.data);
    throw new Error('Invalid response from OpenAI API. The API response did not contain the expected image URL.');
  }
}

/**
 * Generate image using Hugging Face
 */
async function generateHuggingFaceImage(model, prompt, apiKey) {
  console.log(`Using Hugging Face API: ${model.name}`);
  
  // Using Hugging Face's model
  const apiUrl = `${model.providerConfig.baseUrl}${model.apiPath}`;
  console.log('Calling API at:', apiUrl);
  
  const requestData = {
    inputs: prompt,
    options: {
      wait_for_model: true
    }
  };
  
  console.log('Request data:', JSON.stringify(requestData, null, 2));
  
  // Make request to Hugging Face
  const response = await axios({
    method: 'post',
    url: apiUrl,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    data: requestData,
    timeout: 120000, // 120 second timeout (Hugging Face can be slow)
    responseType: 'arraybuffer' // Response is binary image data
  });
  
  console.log('Hugging Face response received');
  
  // Convert binary data to base64
  const base64Image = Buffer.from(response.data).toString('base64');
  return `data:image/jpeg;base64,${base64Image}`;
}

/**
 * Generate image using Replicate
 */
async function generateReplicateImage(model, prompt, apiKey) {
  console.log(`Using Replicate API: ${model.name}`);
  
  const apiUrl = `${model.providerConfig.baseUrl}${model.apiPath}`;
  console.log('Calling API at:', apiUrl);
  
  const requestData = {
    version: model.modelVersion,
    input: {
      prompt: prompt,
      negative_prompt: "low quality, bad quality",
      width: 768,
      height: 768
    }
  };
  
  console.log('Request data:', JSON.stringify(requestData, null, 2));
  
  // Request prediction creation
  const response = await axios({
    method: 'post',
    url: apiUrl,
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json'
    },
    data: requestData,
    timeout: 30000 // 30 second timeout for initial request
  });
  
  // Get prediction ID and poll for results
  const predictionId = response.data.id;
  console.log(`Replicate prediction created with ID: ${predictionId}`);
  
  // Poll for results (Replicate is async)
  let status = 'starting';
  let resultData = null;
  let attempts = 0;
  const maxAttempts = 30; // Max 30 attempts (30 seconds)
  
  while (status !== 'succeeded' && status !== 'failed' && attempts < maxAttempts) {
    // Wait 1 second between polls
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check prediction status
    const statusResponse = await axios({
      method: 'get',
      url: `${model.providerConfig.baseUrl}/predictions/${predictionId}`,
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    status = statusResponse.data.status;
    resultData = statusResponse.data;
    attempts++;
    
    console.log(`Replicate prediction status (attempt ${attempts}): ${status}`);
  }
  
  if (status !== 'succeeded') {
    throw new Error(`Replicate prediction failed or timed out. Status: ${status}`);
  }
  
  // Get the output image URL
  if (resultData && resultData.output && resultData.output[0]) {
    return resultData.output[0]; // First image in the results
  } else {
    throw new Error('No image generated by Replicate');
  }
}

/**
 * Generate image using DeepInfra
 */
async function generateDeepInfraImage(model, prompt, apiKey) {
  console.log(`Using DeepInfra API: ${model.name}`);
  
  const apiUrl = `${model.providerConfig.baseUrl}${model.apiPath}`;
  console.log('Calling API at:', apiUrl);
  
  const requestData = {
    input: {
      prompt: prompt,
      negative_prompt: "low quality, bad quality, blurry",
      num_inference_steps: 30,
      guidance_scale: 7.5
    }
  };
  
  console.log('Request data:', JSON.stringify(requestData, null, 2));
  
  const response = await axios({
    method: 'post',
    url: apiUrl,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    data: requestData,
    timeout: 60000 // 60 second timeout
  });
  
  console.log('DeepInfra response received');
  
  if (response.data && response.data.output && response.data.output[0]) {
    return response.data.output[0];
  } else {
    throw new Error('No image was returned by DeepInfra API');
  }
}

/**
 * Generate image using Craiyon
 */
async function generateCraiyonImage(model, prompt) {
  console.log('Using Craiyon API (free, no key required)');
  
  const apiUrl = `${model.providerConfig.baseUrl}${model.apiPath}`;
  console.log('Calling API at:', apiUrl);
  
  const requestData = {
    prompt: prompt,
    negative_prompt: "low quality, bad quality, blurry",
    version: "c4ue22fb7kb0"
  };
  
  console.log('Request data:', JSON.stringify(requestData, null, 2));
  
  // Craiyon can be slow, so we use a longer timeout
  const response = await axios({
    method: 'post',
    url: apiUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    data: requestData,
    timeout: 120000 // 120 second timeout
  });
  
  console.log('Craiyon response received');
  
  if (response.data && response.data.images && response.data.images.length > 0) {
    // Craiyon returns multiple images, we'll just use the first one
    // Images come as base64 encoded strings
    return `data:image/jpeg;base64,${response.data.images[0]}`;
  } else {
    throw new Error('No image was returned by Craiyon API');
  }
}

/**
 * Test connection to a provider
 * @param {string} providerId - The provider ID
 * @returns {Promise<Object>} - A promise that resolves to the test result
 */
async function testProviderConnection(providerId) {
  const provider = modelConfig.getProviderConfig(providerId);
  if (!provider) {
    throw new Error(`Invalid provider: ${providerId}`);
  }
  
  // Skip test for providers that don't require API keys
  if (!provider.apiKey) {
    return { success: true, message: `${provider.name} does not require an API key` };
  }
  
  const apiKey = modelConfig.getApiKey(providerId);
  if (!apiKey) {
    throw new Error(`${provider.name} API key is missing. Add ${provider.apiKey} to your environment variables.`);
  }
  
  // Skip test if no test endpoint is defined
  if (!provider.testEndpoint) {
    return { success: true, message: `No test endpoint defined for ${provider.name}` };
  }
  
  const testUrl = `${provider.baseUrl}${provider.testEndpoint}`;
  
  // Set up headers based on provider
  let headers = { 'Content-Type': 'application/json' };
  
  if (providerId === 'replicate') {
    headers['Authorization'] = `Token ${apiKey}`;
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  // Make the test request
  const response = await axios({
    method: 'get',
    url: testUrl,
    headers,
    timeout: 10000 // 10 second timeout for tests
  });
  
  return {
    success: true,
    message: `${provider.name} API connection successful`,
    data: response.data
  };
}

module.exports = {
  generateImage,
  testProviderConnection
}; 