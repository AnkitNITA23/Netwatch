import React, { useState } from 'react';
import { FiSearch, FiChevronDown, FiChevronUp, FiClock, FiX } from 'react-icons/fi';

export const HistoryTimeline = ({ history, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiClock className="text-neon-purple" />
          Traffic History
        </h3>
        <div className="flex items-center justify-center h-48">
          <p className="text-danger font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const historyData = Array.isArray(history)
    ? history
    : Array.isArray(history?.history)
      ? history.history
      : [];

  // Filter history based on search term
  const filteredHistory = historyData.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.timestamp?.toLowerCase().includes(searchLower) ||
      item.total_packets?.toString().includes(searchLower) ||
      item.unique_sources?.toString().includes(searchLower)
    );
  });

  return (
    <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl hover:border-neon-blue/50 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiClock className="text-neon-purple" />
            Traffic History
          </h3>
          <p className="text-xs text-gray-400 mt-1">Historical snapshots (last {historyData.length})</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by timestamp or packets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-surface/50 border border-dark-surface-light/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all duration-300"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gradient-to-r from-dark-surface to-dark-surface-light rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
          {filteredHistory.map((item, idx) => (
            <div key={idx} className="group">
              <button
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className="w-full p-4 rounded-lg bg-dark-surface/50 hover:bg-dark-surface-light/50 border border-dark-surface-light/20 hover:border-neon-purple/30 transition-all duration-300 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.total_packets} packets • {item.unique_sources} sources
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-bold text-neon-blue">{item.total_packets}</p>
                      <p className="text-xs text-gray-400">packets</p>
                    </div>
                    {expandedIndex === idx ? (
                      <FiChevronUp className="text-neon-purple" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedIndex === idx && (
                <div className="mt-2 p-4 rounded-lg bg-dark-surface/30 border border-neon-purple/20">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Total Packets</p>
                      <p className="text-lg font-bold text-neon-blue mt-1">{item.total_packets}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Unique Sources</p>
                      <p className="text-lg font-bold text-neon-purple mt-1">{item.unique_sources}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Top Source</p>
                      <p className="text-sm font-mono text-gray-300 mt-1">
                        {item.top_source?.[0] || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Top Source Packets</p>
                      <p className="text-sm font-bold text-success mt-1">
                        {item.top_source?.[1] || 0}
                      </p>
                    </div>
                  </div>

                  {/* Alerts in this snapshot */}
                  {item.alerts && item.alerts.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-dark-surface-light">
                      <p className="text-xs text-gray-400 mb-2">Alerts</p>
                      <div className="space-y-2">
                        {item.alerts.map((alert, aidx) => (
                          <div key={aidx} className="text-xs px-2 py-1 bg-danger/10 border border-danger/30 rounded">
                            <p className="text-danger">{alert}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">
            {searchTerm ? 'No matching records found' : 'No history available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryTimeline;
