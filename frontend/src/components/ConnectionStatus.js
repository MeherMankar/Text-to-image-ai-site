import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import ConnectionTroubleshooter from './ConnectionTroubleshooter';

function ConnectionStatus() {
  const [status, setStatus] = useState('checking');
  const [apiUrl, setApiUrl] = useState('');
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);
  
  useEffect(() => {
    // Get the API URL from environment
    setApiUrl(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const checkConnection = async () => {
    setStatus('checking');
    try {
      await apiService.checkHealth();
      setStatus('connected');
    } catch (error) {
      console.error('Connection check failed:', error);
      setStatus('disconnected');
    }
  };
  
  if (status === 'connected') {
    return null; // Don't show anything when connected
  }
  
  return (
    <>
      <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        status === 'checking' ? 'bg-yellow-100' : 'bg-red-100'
      }`}>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            status === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <div>
            <p className="font-medium">
              {status === 'checking' ? 'Checking connection...' : 'Backend connection failed'}
            </p>
            <p className="text-sm mt-1">
              {status === 'disconnected' && (
                <>
                  Cannot connect to <span className="font-mono text-xs">{apiUrl}</span>
                </>
              )}
            </p>
            <div className="mt-2 flex space-x-2">
              <button 
                onClick={checkConnection}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Retry
              </button>
              
              {status === 'disconnected' && (
                <button 
                  onClick={() => setShowTroubleshooter(true)}
                  className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-800"
                >
                  Troubleshoot
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showTroubleshooter && (
        <ConnectionTroubleshooter onClose={() => setShowTroubleshooter(false)} />
      )}
    </>
  );
}

export default ConnectionStatus; 