# AI Image Generator Backend

This is the backend server for the AI Image Generator application. It provides a unified API for multiple text-to-image AI services.

## Features

- Support for multiple AI image generation services:
  - Stability AI (Stable Diffusion)
  - OpenAI (DALL-E 3)
  - Hugging Face
  - Replicate
  - DeepInfra
  - Craiyon (always free)
- Dynamic model discovery based on available API keys
- Enable/disable specific providers or models
- Comprehensive error handling
- Rate limiting to prevent abuse

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and add your API keys:
   ```
   cp .env.example .env
   ```
4. Start the server:
   ```
   npm start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port (default: 5000) | No |
| STABILITY_API_KEY | Stability AI API key | No |
| OPENAI_API_KEY | OpenAI API key | No |
| HUGGINGFACE_API_KEY | Hugging Face API key | No |
| REPLICATE_API_KEY | Replicate API key | No |
| DEEPINFRA_API_KEY | DeepInfra API key | No |
| ENABLE_STABILITY_AI | Enable/disable Stability AI (default: true) | No |
| ENABLE_OPENAI | Enable/disable OpenAI (default: true) | No |
| ENABLE_HUGGINGFACE | Enable/disable Hugging Face (default: true) | No |
| ENABLE_REPLICATE | Enable/disable Replicate (default: true) | No |
| ENABLE_DEEPINFRA | Enable/disable DeepInfra (default: true) | No |
| ENABLE_CRAIYON | Enable/disable Craiyon (default: true) | No |
| NODE_ENV | Environment (development/production) | No |

## API Endpoints

- `GET /` - Server status
- `GET /api/models` - Get available models
- `POST /api/generate` - Generate an image
- `GET /api/verify-keys` - Verify API keys
- `GET /api/test-provider/:providerId` - Test provider connection

## Adding a New AI Provider

To add a new AI provider, follow these steps:

1. **Update the models configuration file**

   Edit `config/models.js` and add a new provider entry:

   ```javascript
   newProvider: {
     name: 'New Provider',
     apiKey: 'NEW_PROVIDER_API_KEY',
     enabled: 'ENABLE_NEW_PROVIDER',
     free: true, // or false
     baseUrl: 'https://api.newprovider.com',
     testEndpoint: '/test-endpoint',
     models: [
       {
         id: 'new-provider-model',
         name: 'Model Name',
         apiPath: '/generate',
         description: 'Description of the model'
       }
     ]
   }
   ```

2. **Add the API handler function**

   Edit `utils/apiHandler.js` and add a new function to handle the API:

   ```javascript
   async function generateNewProviderImage(model, prompt, apiKey) {
     console.log(`Using New Provider API: ${model.name}`);
     
     const apiUrl = `${model.providerConfig.baseUrl}${model.apiPath}`;
     console.log('Calling API at:', apiUrl);
     
     // Add your API-specific request data and headers
     const requestData = {
       // API-specific request format
     };
     
     const response = await axios({
       method: 'post',
       url: apiUrl,
       headers: {
         'Authorization': `Bearer ${apiKey}`,
         'Content-Type': 'application/json'
       },
       data: requestData,
       timeout: 60000
     });
     
     // Process the response and return the image URL
     return response.data.imageUrl;
   }
   ```

3. **Update the generateImage function**

   Add your new provider to the switch statement in the `generateImage` function:

   ```javascript
   switch (providerId) {
     // Existing cases...
     case 'newProvider':
       return generateNewProviderImage(model, prompt, apiKey);
     default:
       throw new Error(`Unsupported provider: ${providerId}`);
   }
   ```

4. **Update the .env.example file**

   Add the new environment variables:

   ```
   NEW_PROVIDER_API_KEY=your_new_provider_api_key_here
   ENABLE_NEW_PROVIDER=true
   ```

## Customizing Model Parameters

Each provider's API call can be customized by modifying the corresponding function in `utils/apiHandler.js`. For example, to change the image size for Stability AI:

```javascript
const requestData = {
  text_prompts: [{ text: prompt }],
  cfg_scale: 7,
  height: 768, // Change from 1024 to 768
  width: 768,  // Change from 1024 to 768
  samples: 1,
  steps: 30
};
```

## Troubleshooting

- **API Key Issues**: Ensure your API keys are correctly set in the `.env` file
- **CORS Errors**: Check the CORS configuration in `server.js`
- **Rate Limiting**: Adjust the rate limiter settings in `server.js` if needed
- **Timeout Errors**: Increase the timeout values in API requests for slower providers

## License

MIT 