import React from 'react';

/**
 * Component to display information about an AI model
 * 
 * @param {Object} props
 * @param {Object} props.model - The model object with details
 */
function ModelInfoCard({ model }) {
  if (!model) return null;
  
  // Get provider-specific information
  const getProviderInfo = () => {
    switch (model.provider) {
      case 'openai':
        return {
          title: 'OpenAI',
          description: 'Creates detailed, realistic images with high accuracy to text prompts.',
          color: 'from-blue-500 to-blue-700',
          lightColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          icon: '🧠'
        };
      case 'stability':
        return {
          title: 'Stability AI',
          description: 'Excels at creative and artistic image generation with fine details.',
          color: 'from-purple-500 to-purple-700',
          lightColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
          icon: '🌈'
        };
      case 'huggingface':
        return {
          title: 'Hugging Face',
          description: 'Open source AI models with good quality at no cost.',
          color: 'from-yellow-500 to-yellow-600',
          lightColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          icon: '🤗'
        };
      case 'replicate':
        return {
          title: 'Replicate',
          description: 'Cloud platform for various open source models with free trial credits.',
          color: 'from-green-500 to-green-700',
          lightColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          icon: '♻️'
        };
      case 'deepinfra':
        return {
          title: 'DeepInfra',
          description: 'Fast, high-quality AI models with free API credits.',
          color: 'from-indigo-500 to-indigo-700',
          lightColor: 'bg-indigo-50',
          textColor: 'text-indigo-700',
          borderColor: 'border-indigo-200',
          icon: '⚡'
        };
      case 'craiyon':
        return {
          title: 'Craiyon',
          description: 'Always free image generation service, formerly DALL-E Mini.',
          color: 'from-pink-500 to-pink-700',
          lightColor: 'bg-pink-50',
          textColor: 'text-pink-700',
          borderColor: 'border-pink-200',
          icon: '🖌️'
        };
      default:
        return {
          title: model.provider,
          description: 'AI-powered image generation',
          color: 'from-gray-500 to-gray-700',
          lightColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          icon: '🔮'
        };
    }
  };
  
  const providerInfo = getProviderInfo();
  
  return (
    <div className={`rounded-lg overflow-hidden shadow-md border ${providerInfo.borderColor}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${providerInfo.color} text-white p-4`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{providerInfo.icon}</span>
            <h3 className="font-bold text-lg">
              {model.name}
            </h3>
          </div>
          <div className="flex space-x-2">
            {model.free && (
              <span className="px-2 py-1 bg-white bg-opacity-25 text-white text-xs font-semibold rounded-full">
                Free
              </span>
            )}
            {!model.free && (
              <span className="px-2 py-1 bg-white bg-opacity-25 text-white text-xs font-semibold rounded-full">
                Paid
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className={`p-4 ${providerInfo.lightColor}`}>
        <div className="flex items-start">
          <div className="flex-grow">
            <p className="text-sm text-gray-600 mb-2">
              {model.description || providerInfo.description}
            </p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {model.provider === 'stability' && (
                <Chip label="Artistic" color="bg-purple-100" textColor="text-purple-700" />
              )}
              {model.provider === 'openai' && (
                <Chip label="Photorealistic" color="bg-blue-100" textColor="text-blue-700" />
              )}
              {model.provider === 'huggingface' && (
                <Chip label="Open Source" color="bg-yellow-100" textColor="text-yellow-700" />
              )}
              {model.provider === 'replicate' && (
                <Chip label="Versatile" color="bg-green-100" textColor="text-green-700" />
              )}
              {model.provider === 'deepinfra' && (
                <Chip label="Fast" color="bg-indigo-100" textColor="text-indigo-700" />
              )}
              {model.provider === 'craiyon' && (
                <Chip label="Always Free" color="bg-pink-100" textColor="text-pink-700" />
              )}
              
              {model.id.includes('xl') && (
                <Chip label="High Quality" color="bg-amber-100" textColor="text-amber-700" />
              )}
              
              {model.id.includes('v1-5') && (
                <Chip label="Fast Generation" color="bg-emerald-100" textColor="text-emerald-700" />
              )}
              
              {!model.requires_key && (
                <Chip label="No API Key" color="bg-teal-100" textColor="text-teal-700" />
              )}
            </div>
            
            {!model.available && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                <span className="font-semibold">⚠️ API Key Required:</span> Add {model.provider.toUpperCase()}_API_KEY to your .env file
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Small component for feature tags
const Chip = ({ label, color, textColor }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${color} ${textColor}`}>
    {label}
  </span>
);

export default ModelInfoCard; 