import React, { useState } from 'react';

const OrderSuccessAlert = ({ orderId, onClose, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback untuk browser yang tidak support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = orderId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          {/* Success Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-green-800 mb-2">Order Placed Successfully!</h4>
            
            {/* Order ID Box */}
            <div className="bg-white rounded border p-3 mb-3">
              <p className="text-xs text-gray-600 mb-1">Your Order ID:</p>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800 break-all">{orderId}</code>
                <button
                  onClick={handleCopy}
                  className="ml-2 p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors flex items-center gap-1"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <p className="text-sm text-green-700">
              Save this Order ID to track your order status. Redirecting to orders page in 5 seconds...
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-green-100 transition-colors"
          >
            <svg className="w-4 h-4 text-green-600 hover:text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessAlert;