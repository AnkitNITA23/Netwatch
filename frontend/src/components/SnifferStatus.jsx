import React from 'react';
import { FiWifi, FiWifiOff, FiRefreshCw } from 'react-icons/fi';

export const SnifferStatus = ({ snifferStatus, loading, error, onRetry }) => {
  const isActive = snifferStatus?.sniffing === true;

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiWifiOff className="text-warning" />
          Packet Sniffer
        </h3>
        <div className="flex flex-col items-center justify-center h-24 gap-3">
          <p className="text-danger font-semibold text-sm">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-neon-blue hover:text-neon-purple transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl hover:border-neon-blue/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            {isActive ? (
              <FiWifi className="text-success" />
            ) : (
              <FiWifiOff className="text-warning" />
            )}
            Packet Sniffer
          </h3>
          <p className="text-xs text-gray-400 mt-1">Live network capture status</p>
        </div>
        <button
          onClick={onRetry}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-dark-surface-light/50 transition-colors duration-200 disabled:opacity-50"
        >
          <FiRefreshCw className={`text-neon-blue ${loading ? 'animate-spin' : ''}`} size={18} />
        </button>
      </div>

      {loading ? (
        <div className="h-20 bg-gradient-to-r from-dark-surface to-dark-surface-light rounded-lg animate-pulse" />
      ) : (
        <div className={`p-4 rounded-lg border ${isActive ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-success animate-pulse' : 'bg-warning'}`} />
            <div>
              <p className={`text-sm font-semibold ${isActive ? 'text-success' : 'text-warning'}`}>
                {isActive ? 'Capturing packets' : 'Sniffer disabled'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {snifferStatus?.message || 'Status unknown'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnifferStatus;
