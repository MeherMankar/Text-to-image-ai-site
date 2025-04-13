import React from 'react';

/**
 * Application header component with logo and navigation
 */
function AppHeader() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="text-3xl mr-2">🎨</div>
          <div>
            <h1 className="text-2xl font-bold">AI Image Creator</h1>
            <p className="text-indigo-200 text-sm">Generate stunning images with AI</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex space-x-1 sm:space-x-3">
          <NavButton active={true}>Create</NavButton>
          <NavButton>Gallery</NavButton>
          <NavButton>Help</NavButton>
          <NavButton special={true}>
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New
          </NavButton>
        </nav>
      </div>
      
      {/* Feature Banner - Uncomment if needed */}
      {/*
      <div className="bg-indigo-800 text-center py-2 px-4 text-sm">
        <span className="font-medium">New!</span> We've added support for multiple free AI models. 
        <a href="#models" className="underline ml-1 text-indigo-200 hover:text-white">Explore now</a>
      </div>
      */}
    </header>
  );
}

// Navigation button component
const NavButton = ({ children, active = false, special = false }) => {
  if (special) {
    return (
      <button className="bg-white text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors shadow-sm">
        {children}
      </button>
    );
  }
  
  return (
    <button 
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-white/10 text-white' 
          : 'text-indigo-100 hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

export default AppHeader; 