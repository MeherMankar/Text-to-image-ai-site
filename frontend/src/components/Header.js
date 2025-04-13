import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 mr-3" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold">Text-to-Image Generator</h1>
          </div>
          <div>
            <p className="text-sm md:text-base">
              Transform your ideas into stunning visuals with AI
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 