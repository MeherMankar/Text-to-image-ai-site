import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import BillingErrorNotice from './BillingErrorNotice';
import ModelInfoCard from './ModelInfoCard';

function ImageGenerator({ onGenerationStart, onImageGenerated, onError, isLoading }) {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('');
  const [serverStatus, setServerStatus] = useState('unknown'); // 'unknown', 'connected', 'disconnected'
  const [showBillingError, setShowBillingError] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsByProvider, setModelsByProvider] = useState({});
  const [expandedProvider, setExpandedProvider] = useState(null);
  
  // Provider colors and icons
  const providerThemes = {
    stability: { color: 'bg-purple-600', lightColor: 'bg-purple-100', textColor: 'text-purple-700', icon: '🌈' },
    openai: { color: 'bg-blue-600', lightColor: 'bg-blue-100', textColor: 'text-blue-700', icon: '🧠' },
    huggingface: { color: 'bg-yellow-500', lightColor: 'bg-yellow-100', textColor: 'text-yellow-700', icon: '🤗' },
    replicate: { color: 'bg-green-600', lightColor: 'bg-green-100', textColor: 'text-green-700', icon: '♻️' },
    deepinfra: { color: 'bg-indigo-600', lightColor: 'bg-indigo-100', textColor: 'text-indigo-700', icon: '⚡' },
    craiyon: { color: 'bg-pink-500', lightColor: 'bg-pink-100', textColor: 'text-pink-700', icon: '🖌️' }
  };
  
  // Check server connection and load available models on component mount
  useEffect(() => {
    checkServerConnection();
    fetchAvailableModels();
  }, []);
  
  const checkServerConnection = async () => {
    try {
      await apiService.checkHealth();
      setServerStatus('connected');
    } catch (error) {
      console.error('Server connection check failed:', error);
      setServerStatus('disconnected');
    }
  };

  const fetchAvailableModels = async () => {
    try {
      setModelsLoading(true);
      const models = await apiService.getModels();
      
      // Group models by provider
      const groupedModels = {};
      models.forEach(model => {
        if (!groupedModels[model.provider]) {
          groupedModels[model.provider] = [];
        }
        groupedModels[model.provider].push(model);
      });
      
      setModelsByProvider(groupedModels);
      setAvailableModels(models);
      
      // Set initial model if none is selected
      if (!model && models.length > 0) {
        // Find first available and enabled model
        const firstAvailableModel = models.find(m => m.available && m.enabled) || models[0];
        setModel(firstAvailableModel.id);
        
        // Set the provider of the selected model as expanded
        setExpandedProvider(firstAvailableModel.provider);
      }
    } catch (error) {
      console.error('Failed to fetch available models:', error);
      // Set some default models in case of error
      setAvailableModels([
        { id: 'stable-diffusion-xl', name: 'Stability AI (SDXL)', available: true, free: false, provider: 'stability' },
        { id: 'dalle', name: 'DALL-E 3', available: true, free: false, provider: 'openai' },
        { id: 'craiyon', name: 'Craiyon (Free)', available: true, free: true, provider: 'craiyon' }
      ]);
      
      // Set default model
      if (!model) {
        setModel('craiyon');
        setExpandedProvider('craiyon');
      }
    } finally {
      setModelsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      onError('Please enter a prompt');
      return;
    }
    
    // Check if we already know the server is disconnected
    if (serverStatus === 'disconnected') {
      onError('Cannot connect to the server. Please check your connection settings.');
      return;
    }
    
    onGenerationStart();
    setShowBillingError(false); // Reset billing error state
    
    try {
      const response = await apiService.generateImage(prompt, model);
      
      if (response.success && response.imageUrl) {
        const timestamp = new Date().toISOString();
        onImageGenerated({
          id: timestamp,
          prompt,
          model,
          url: response.imageUrl,
          timestamp
        });
        
        // Clear the prompt after successful generation
        setPrompt('');
      } else {
        onError('Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      
      // Check for OpenAI billing error
      if (error.message && error.message.includes('billing limit reached')) {
        setShowBillingError(true);
      }
      
      // Handle the connection error
      if (error.originalError && !error.originalError.response) {
        setServerStatus('disconnected');
        onError('Cannot connect to the server. Please check that the backend is running and properly configured.');
      } else {
        onError(error.message || 'Failed to generate image. Please try again.');
      }
    }
  };
  
  // Toggle provider expansion
  const toggleProvider = (providerId) => {
    if (expandedProvider === providerId) {
      setExpandedProvider(null);
    } else {
      setExpandedProvider(providerId);
    }
  };

  // Get the currently selected model information
  const selectedModel = availableModels.find(m => m.id === model) || {};
  
  // Handle selection of a model
  const handleModelSelection = (modelId) => {
    setModel(modelId);
    
    // Automatically close the provider after selection
    setTimeout(() => {
      setExpandedProvider(null);
    }, 300);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="mr-2">✨</span>
        Generate an Image
        <span className="ml-2">✨</span>
      </h2>
      
      {serverStatus === 'disconnected' && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 animate-pulse">
          <p className="font-bold flex items-center">
            <span className="mr-2">⚠️</span>
            Server Connection Error
          </p>
          <p>Cannot connect to the backend server. Please check the following:</p>
          <ul className="list-disc ml-5 mt-2">
            <li>The backend server is running</li>
            <li>REACT_APP_API_URL is correctly set in your .env file</li>
            <li>There are no CORS issues preventing connection</li>
          </ul>
          <button 
            onClick={checkServerConnection}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 shadow-sm"
          >
            Retry Connection
          </button>
        </div>
      )}
      
      {showBillingError && <BillingErrorNotice />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PROMPT INPUT SECTION */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <label htmlFor="prompt" className="block text-gray-700 font-medium mb-2">
            What would you like to create?
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
              rows="3"
              placeholder="Describe the image you want to generate in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading || serverStatus === 'disconnected'}
              required
            />
            <div className="absolute right-3 bottom-3 text-gray-400 text-sm">
              {prompt.length} characters
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Tip: Be specific and detailed for better results. Mention style, lighting, and composition.
          </p>
        </div>
        
        {/* MODEL SELECTION SECTION */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-gray-700 font-medium">
              Select AI Model
            </label>
            {selectedModel && (
              <div className="text-sm text-gray-500">
                Currently using: <span className="font-medium">{selectedModel.name}</span>
              </div>
            )}
          </div>
          
          {modelsLoading ? (
            <div className="p-4 border rounded-md bg-gray-50 text-center">
              <div className="animate-pulse flex space-x-4 items-center justify-center">
                <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                <div className="flex-1 space-y-2 max-w-md">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
              <p className="text-gray-500 mt-3">Loading available models...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Selected model card */}
              {selectedModel && (
                <ModelInfoCard model={selectedModel} />
              )}
              
              {/* Collapsible provider sections */}
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Change model:
                </div>
                <div className="space-y-2">
                  {Object.entries(modelsByProvider).map(([providerId, models]) => {
                    const theme = providerThemes[providerId] || { 
                      color: 'bg-gray-600', 
                      lightColor: 'bg-gray-100',
                      textColor: 'text-gray-700',
                      icon: '🔄'
                    };
                    
                    const isExpanded = expandedProvider === providerId;
                    const hasEnabledModels = models.some(m => m.enabled);
                    
                    if (!hasEnabledModels) return null;
                    
                    return (
                      <div key={providerId} className="border rounded-md overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleProvider(providerId)}
                          className={`w-full p-3 text-left flex items-center justify-between transition-colors duration-200 ${theme.lightColor} ${theme.textColor}`}
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{theme.icon}</span>
                            <span className="font-medium capitalize">{providerId}</span>
                            {models[0]?.free && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Free
                              </span>
                            )}
                          </div>
                          <svg
                            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Model options when expanded */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                          <div className="p-3 bg-white border-t">
                            <div className="space-y-2">
                              {models
                                .filter(m => m.enabled) // Only show enabled models
                                .map(modelItem => (
                                  <div 
                                    key={modelItem.id} 
                                    className={`flex items-center p-2 rounded-md ${model === modelItem.id ? `${theme.lightColor} border border-${theme.color.replace('bg-', '')}` : 'hover:bg-gray-50'}`}
                                  >
                                    <input
                                      type="radio"
                                      id={modelItem.id}
                                      name="model"
                                      value={modelItem.id}
                                      checked={model === modelItem.id}
                                      onChange={() => handleModelSelection(modelItem.id)}
                                      disabled={!modelItem.available || isLoading || serverStatus === 'disconnected'}
                                      className="mr-3"
                                    />
                                    <label 
                                      htmlFor={modelItem.id}
                                      className={`flex-grow cursor-pointer ${!modelItem.available ? 'text-gray-400' : 'text-gray-700'}`}
                                    >
                                      <div>{modelItem.name.replace(/^.*\(|\)$/g, '')}</div>
                                      <div className="text-xs text-gray-500">{modelItem.description}</div>
                                      {!modelItem.available && (
                                        <span className="ml-1 text-xs text-red-500 font-semibold">
                                          (API Key Required)
                                        </span>
                                      )}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-all duration-200 shadow-md transform hover:scale-[1.02] active:scale-[0.98] ${
            isLoading || serverStatus === 'disconnected'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          }`}
          disabled={isLoading || serverStatus === 'disconnected'}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating your image...
            </div>
          ) : (
            <>
              <span className="mr-1">✨</span>
              Generate Image
              <span className="ml-1">✨</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ImageGenerator; 