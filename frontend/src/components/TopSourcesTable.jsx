import React from 'react';
import { FiTrendingUp, FiChevronRight } from 'react-icons/fi';
import { HiOutlineGlobeAlt } from 'react-icons/hi';

export const TopSourcesTable = ({ stats, loading, error, onRetry }) => {
  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Top IP Sources</h3>
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <p className="text-danger font-semibold">{error}</p>
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

  const topSources = stats?.all_sources
    ? Object.entries(stats.all_sources)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map((entry, idx) => ({
          rank: idx + 1,
          ip: entry[0],
          packets: entry[1],
          percentage: ((entry[1] / stats.total_packets) * 100).toFixed(2),
        }))
    : [];

  return (
    <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl hover:border-neon-blue/50 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiTrendingUp className="text-neon-purple" />
            Top IP Sources
          </h3>
          <p className="text-xs text-gray-400 mt-1">Ranked by packet count</p>
        </div>
        <div className="text-xs text-gray-400">
          {topSources.length} sources
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gradient-to-r from-dark-surface to-dark-surface-light rounded-lg animate-pulse" />
          ))}
        </div>
      ) : topSources.length > 0 ? (
        <div className="space-y-2">
          {topSources.map((source) => (
            <div
              key={source.ip}
              className="group p-4 rounded-lg bg-dark-surface/50 hover:bg-dark-surface-light/50 border border-dark-surface-light/20 hover:border-neon-purple/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-purple-600 text-white font-bold text-sm">
                    {source.rank}
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineGlobeAlt className="text-neon-blue" size={18} />
                    <span className="text-white font-mono font-semibold">{source.ip}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-white font-semibold text-sm">{source.packets.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{source.percentage}%</div>
                  </div>
                  <FiChevronRight className="text-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1 bg-dark-surface-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"
                  style={{ width: `${Math.min((source.packets / (topSources[0]?.packets || 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-400">No traffic data available</p>
        </div>
      )}
    </div>
  );
};

export default TopSourcesTable;
