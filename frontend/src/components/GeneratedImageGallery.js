import React, { useState } from 'react';

/**
 * Component to display a gallery of generated images
 * 
 * @param {Object} props
 * @param {Array} props.images - Array of generated image objects
 */
function GeneratedImageGallery({ images = [] }) {
  const [expandedImage, setExpandedImage] = useState(null);
  
  if (!images || images.length === 0) {
    return null;
  }
  
  // Get provider name from model ID
  const getProviderName = (modelId) => {
    if (modelId.includes('stable-diffusion') || modelId.includes('stability')) return 'Stability AI';
    if (modelId.includes('dalle')) return 'OpenAI';
    if (modelId.includes('huggingface')) return 'Hugging Face';
    if (modelId.includes('replicate')) return 'Replicate';
    if (modelId.includes('deepinfra')) return 'DeepInfra';
    if (modelId.includes('craiyon')) return 'Craiyon';
    return 'AI Provider';
  };
  
  // Get provider color from model ID
  const getProviderColor = (modelId) => {
    if (modelId.includes('stable-diffusion') || modelId.includes('stability')) 
      return { bg: 'bg-purple-100', text: 'text-purple-800', gradient: 'from-purple-500 to-purple-700' };
    if (modelId.includes('dalle')) 
      return { bg: 'bg-blue-100', text: 'text-blue-800', gradient: 'from-blue-500 to-blue-700' };
    if (modelId.includes('huggingface')) 
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', gradient: 'from-yellow-500 to-yellow-600' };
    if (modelId.includes('replicate')) 
      return { bg: 'bg-green-100', text: 'text-green-800', gradient: 'from-green-500 to-green-700' };
    if (modelId.includes('deepinfra')) 
      return { bg: 'bg-indigo-100', text: 'text-indigo-800', gradient: 'from-indigo-500 to-indigo-700' };
    if (modelId.includes('craiyon')) 
      return { bg: 'bg-pink-100', text: 'text-pink-800', gradient: 'from-pink-500 to-pink-700' };
    return { bg: 'bg-gray-100', text: 'text-gray-800', gradient: 'from-gray-500 to-gray-700' };
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };
  
  // Open expanded view
  const openExpandedView = (image) => {
    setExpandedImage(image);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  // Close expanded view
  const closeExpandedView = () => {
    setExpandedImage(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <span className="mr-2">🖼️</span>
        Your Generated Images
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => {
          const providerName = getProviderName(image.model);
          const colors = getProviderColor(image.model);
          
          return (
            <div 
              key={image.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform hover:shadow-lg hover:scale-[1.02] cursor-pointer"
              onClick={() => openExpandedView(image)}
            >
              <div className={`relative pb-[100%] bg-gradient-to-br ${colors.bg} overflow-hidden`}>
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm font-medium truncate mb-1">{image.prompt}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${colors.bg} ${colors.text}`}>
                      {providerName}
                    </span>
                    <span className="text-white text-xs opacity-80">
                      {formatTimestamp(image.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Expanded image modal */}
      {expandedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeExpandedView}>
          <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
              onClick={closeExpandedView}
            >
              ×
            </button>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 bg-gray-100">
                <img
                  src={expandedImage.url}
                  alt={expandedImage.prompt}
                  className="w-full h-auto object-contain max-h-[80vh]"
                />
              </div>
              
              <div className="md:w-1/3 p-4 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Image Details</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">Prompt</h4>
                  <p className="text-gray-800">{expandedImage.prompt}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">Generated with</h4>
                  <p className="text-gray-800">{getProviderName(expandedImage.model)}</p>
                  <p className="text-xs text-gray-500">Model: {expandedImage.model}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">Generated on</h4>
                  <p className="text-gray-800">{formatTimestamp(expandedImage.timestamp)}</p>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <a 
                    href={expandedImage.url} 
                    download={`ai-image-${expandedImage.id}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-2 rounded-md text-white text-sm font-medium bg-gradient-to-r ${getProviderColor(expandedImage.model).gradient}`}
                  >
                    Download Image
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratedImageGallery; 