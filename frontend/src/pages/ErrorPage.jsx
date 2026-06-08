import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export const ErrorPage = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-white mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-400 mb-6">{error || 'An unexpected error occurred. Please try again.'}</p>
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-neon-blue/50 transition-all duration-300"
        >
          <FiRefreshCw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
