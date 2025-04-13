import React from 'react';

const BillingErrorNotice = () => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 shadow-sm">
      <div className="flex items-start">
        <div className="text-3xl mr-3">💰</div>
        <div className="flex-1">
          <h3 className="text-orange-800 font-bold text-lg mb-1">OpenAI Billing Limit Reached</h3>
          <p className="text-orange-700 mb-2">
            Your OpenAI account has reached its billing limit. This is common with new accounts or when you've used all your free credits.
          </p>
          
          <div className="bg-white bg-opacity-50 rounded-md p-3 text-sm text-gray-700 border border-orange-200 mb-3">
            <h4 className="font-medium text-orange-700 mb-1">How to fix this:</h4>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Visit <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI's billing page</a></li>
              <li>Add a payment method or purchase additional credits</li>
              <li>Check your usage limits and adjust as needed</li>
            </ol>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <a 
              href="https://platform.openai.com/account/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Go to OpenAI Billing
            </a>
            
            <div className="text-sm text-orange-700 flex items-center">
              <span className="mr-1">💡</span>
              <span>Or try one of the free AI models below</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingErrorNotice; 