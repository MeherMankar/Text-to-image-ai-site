import React, { useState, useEffect } from 'react';
import { diagnoseConnectionIssue } from '../utils/connectionChecker';

function ConnectionTroubleshooter({ onClose }) {
  const [diagnosis, setDiagnosis] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    runDiagnosis();
  }, []);
  
  const runDiagnosis = async () => {
    setIsChecking(true);
    const result = await diagnoseConnectionIssue();
    setDiagnosis(result);
    setIsChecking(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Connection Troubleshooter</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {isChecking ? (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p>Diagnosing connection issues...</p>
          </div>
        ) : diagnosis ? (
          <div>
            <div className="mb-4 p-3 rounded-md bg-gray-100">
              <p className="font-medium">API URL:</p>
              <p className="font-mono text-sm break-all">{diagnosis.apiUrl}</p>
            </div>
            
            <div className={`mb-4 p-3 rounded-md ${diagnosis.isReachable ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="font-medium">Connection Status:</p>
              <p>{diagnosis.isReachable ? 'Connected ✓' : 'Disconnected ✗'}</p>
            </div>
            
            {!diagnosis.isReachable && (
              <>
                <div className="mb-4">
                  <p className="font-medium mb-2">Possible Issues:</p>
                  <ul className="list-disc pl-5">
                    {diagnosis.possibleIssues.map((issue, index) => (
                      <li key={index} className="mb-1">{issue}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <p className="font-medium mb-2">Recommendations:</p>
                  <ul className="list-disc pl-5">
                    {diagnosis.recommendations.map((rec, index) => (
                      <li key={index} className="mb-2">{rec}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={runDiagnosis}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Run Diagnosis Again
              </button>
              
              {!diagnosis.isReachable && (
                <a
                  href="https://github.com/yourusername/text-to-image-generator/blob/main/TROUBLESHOOTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  View Troubleshooting Guide
                </a>
              )}
            </div>
          </div>
        ) : (
          <p>Failed to run diagnosis. Please try again.</p>
        )}
      </div>
    </div>
  );
}

export default ConnectionTroubleshooter; 