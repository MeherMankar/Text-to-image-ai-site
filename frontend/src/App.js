import React, { useState } from 'react';
import './App.css';
import ImageGenerator from './components/ImageGenerator';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import GeneratedImageGallery from './components/GeneratedImageGallery';

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleGenerationStart = () => {
    setIsLoading(true);
    setError(null);
    setShowError(false);
  };

  const handleImageGenerated = (newImage) => {
    setIsLoading(false);
    setImages([newImage, ...images]);
  };

  const handleError = (errorMessage) => {
    setIsLoading(false);
    setError(errorMessage);
    setShowError(true);
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Error notification */}
        {showError && error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setShowError(false)}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Welcome message */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to AI Image Creator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create stunning images from text descriptions using various AI models. 
            Choose from free and paid options to generate the perfect image for your needs.
          </p>
        </div>
        
        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          <ImageGenerator
            onGenerationStart={handleGenerationStart}
            onImageGenerated={handleImageGenerated}
            onError={handleError}
            isLoading={isLoading}
          />
          
          {/* Generated images gallery */}
          <GeneratedImageGallery images={images} />
          
          {/* No images generated yet */}
          {images.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm mt-8">
              <div className="text-5xl mb-4">🖼️</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No images generated yet</h3>
              <p className="text-gray-500 mb-4">Your generated images will appear here.</p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Try entering a detailed prompt like "A red fox sitting in a forest at sunset, photorealistic" to get started.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <AppFooter />
      
      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App; 