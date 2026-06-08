import React from 'react';
import { FiDatabase, FiX, FiRefreshCw } from 'react-icons/fi';
import { MdStorage } from 'react-icons/md';

export const DatabaseStatus = ({ dbStatus, loading, error, onRetry, onSave, saving }) => {
  const isConnected = dbStatus?.connected || dbStatus?.status === 'connected';

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiDatabase className="text-neon-blue" />
            Database Status
          </h3>
          <button
            onClick={onRetry}
            className="p-2 rounded-lg hover:bg-dark-surface-light/50 transition-colors duration-200"
          >
            <FiRefreshCw className="text-neon-blue" size={18} />
          </button>
        </div>
        <div className="text-center">
          <p className="text-danger font-semibold mb-2">Connection Error</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl hover:border-neon-blue/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiDatabase className="text-neon-blue" />
            Database Status
          </h3>
          <p className="text-xs text-gray-400 mt-1">MongoDB Atlas Connection</p>
        </div>
        <button
          onClick={onRetry}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-dark-surface-light/50 transition-colors duration-200 disabled:opacity-50"
        >
          <FiRefreshCw className={`text-neon-blue ${loading ? 'animate-spin' : ''}`} size={18} />
        </button>
      </div>

      {/* Status Card */}
      {loading ? (
        <div className="h-32 bg-gradient-to-r from-dark-surface to-dark-surface-light rounded-lg animate-pulse" />
      ) : (
        <div className={`p-6 rounded-lg border-2 ${isConnected ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${isConnected ? 'bg-success/20' : 'bg-danger/20'}`}>
                {isConnected ? (
                  <MdStorage className="text-success text-2xl" />
                ) : (
                  <FiX className="text-danger text-2xl" />
                )}
              </div>
              <div>
                <h4 className={`text-lg font-bold ${isConnected ? 'text-success' : 'text-danger'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </h4>
                <p className="text-xs text-gray-400">
                  {isConnected ? 'MongoDB Atlas is operational' : 'Unable to connect to database'}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isConnected ? 'bg-success/20' : 'bg-danger/20'}`}>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-danger'}`}></div>
              <span className={`text-xs font-bold ${isConnected ? 'text-success' : 'text-danger'}`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-dark-surface-light">
            <div>
              <p className="text-xs text-gray-400">Database</p>
              <p className="text-sm font-semibold text-white mt-1">{dbStatus?.database || 'netwatch'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Collection</p>
              <p className="text-sm font-semibold text-white mt-1">traffic</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Response Time</p>
              <p className="text-sm font-semibold text-white mt-1">
                {dbStatus?.response_time ? `${(dbStatus.response_time * 1000).toFixed(1)}ms` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Last Check</p>
              <p className="text-sm font-semibold text-white mt-1">
                {dbStatus?.timestamp ? new Date(dbStatus.timestamp).toLocaleTimeString() : 'Just now'}
              </p>
            </div>
          </div>

          {isConnected && onSave && (
            <button
              onClick={onSave}
              disabled={saving}
              className="mt-4 w-full py-2 px-4 rounded-lg bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 text-neon-blue text-sm font-semibold hover:border-neon-blue/60 transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Snapshot to MongoDB'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;
