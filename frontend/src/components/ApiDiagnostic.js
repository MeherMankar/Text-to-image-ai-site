import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const isDevelopment = process.env.NODE_ENV === 'development';

function ApiDiagnostic() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Don't render anything in production mode
  if (!isDevelopment) {
    return null;
  }

  const runDiagnostics = async () => {
    setLoading(true);
    setResults({});
    
    try {
      // Test basic connection
      const basicTest = await testEndpoint('/');
      
      // Test key verification
      const keyTest = await testEndpoint('/api/verify-keys');
      
      // Test Stability API
      const stabilityTest = await testEndpoint('/api/test-stability');
      
      // Test OpenAI API
      const openaiTest = await testEndpoint('/api/test-openai');
      
      setResults({
        basicConnection: basicTest,
        keyVerification: keyTest,
        stabilityApi: stabilityTest,
        openaiApi: openaiTest
      });
    } catch (error) {
      console.error('Error running diagnostics:', error);
      setResults({
        error: true,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testEndpoint = async (endpoint) => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status || 'unknown',
        error: error.message,
        details: error.response?.data || {}
      };
    }
  };

  if (!expanded) {
    return (
      <button 
        onClick={() => setExpanded(true)}
        className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700 z-50"
        style={{ opacity: 0.8 }}
      >
        API Diagnostics
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-auto m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">API Diagnostics (Dev Mode Only)</h2>
          <button 
            onClick={() => setExpanded(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            Close
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white mb-2 mr-4`}
          >
            {loading ? 'Running Tests...' : 'Run API Diagnostics'}
          </button>
          
          <div className="mb-2">
            <p className="text-sm font-mono mb-1">API URL:</p>
            <p className="text-sm bg-gray-100 p-1 rounded">{API_URL}</p>
          </div>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-bold mb-2">Test Results:</h3>
            
            {results.error ? (
              <div className="text-red-600">
                <p>Error running tests: {results.message}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Basic Connection */}
                <div className="border-b pb-2">
                  <div className={`font-medium ${results.basicConnection?.success ? 'text-green-600' : 'text-red-600'}`}>
                    Basic Connection: {results.basicConnection?.success ? 'Success' : 'Failed'}
                  </div>
                  <div className="text-sm mt-1">
                    {results.basicConnection?.success 
                      ? <p>Successfully connected to the API server</p>
                      : <p>Error: {results.basicConnection?.error}</p>
                    }
                  </div>
                </div>
                
                {/* Key Verification */}
                {results.keyVerification && (
                  <div className="border-b pb-2">
                    <div className={`font-medium ${results.keyVerification?.success ? 'text-green-600' : 'text-red-600'}`}>
                      API Keys: {results.keyVerification?.success ? 'Verified' : 'Failed'}
                    </div>
                    <div className="text-sm mt-1">
                      {results.keyVerification?.success && (
                        <ul className="list-disc pl-5">
                          <li>Stability API Key: {results.keyVerification.data.stabilityKeyPresent ? 'Present' : 'Missing'}</li>
                          <li>OpenAI API Key: {results.keyVerification.data.openaiKeyPresent ? 'Present' : 'Missing'}</li>
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Stability API */}
                {results.stabilityApi && (
                  <div className="border-b pb-2">
                    <div className={`font-medium ${results.stabilityApi?.success ? 'text-green-600' : 'text-red-600'}`}>
                      Stability AI API: {results.stabilityApi?.success ? 'Connected' : 'Failed'}
                    </div>
                    <div className="text-sm mt-1">
                      {results.stabilityApi?.success 
                        ? <p>Successfully connected to Stability AI API</p>
                        : <p>Error: {results.stabilityApi?.error || results.stabilityApi?.details?.error}</p>
                      }
                    </div>
                  </div>
                )}
                
                {/* OpenAI API */}
                {results.openaiApi && (
                  <div className="border-b pb-2">
                    <div className={`font-medium ${results.openaiApi?.success ? 'text-green-600' : 'text-red-600'}`}>
                      OpenAI API: {results.openaiApi?.success ? 'Connected' : 'Failed'}
                    </div>
                    <div className="text-sm mt-1">
                      {results.openaiApi?.success 
                        ? <p>Successfully connected to OpenAI API</p>
                        : <p>Error: {results.openaiApi?.error || results.openaiApi?.details?.error}</p>
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApiDiagnostic; 