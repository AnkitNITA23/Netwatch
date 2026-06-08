import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { MdTrendingUp } from 'react-icons/md';

export const TrafficChart = ({ data, loading, error }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.labels && data.values) {
      const formatted = data.labels.map((label, idx) => ({
        time: label,
        packets: data.values[idx] || 0,
      }));
      setChartData(formatted);
    }
  }, [data]);

  if (error) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger font-semibold mb-2">Failed to load chart</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl hover:border-neon-blue/50 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MdTrendingUp className="text-neon-blue" />
            Network Traffic
          </h3>
          <p className="text-xs text-gray-400 mt-1">Real-time packet flow (auto-refresh every 2s)</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-dark-surface-light/50 rounded-lg">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-success font-semibold">Live</span>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-80 bg-gradient-to-r from-dark-surface to-dark-surface-light rounded-lg animate-pulse" />
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData || []}>
              <defs>
                <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00d9ff" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#94a3b8' }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #00d9ff',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                }}
                labelStyle={{ color: '#00d9ff' }}
                formatter={(value) => [
                  <span className="text-neon-blue font-semibold">{value.toLocaleString()}</span>,
                  'Packets',
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="packets"
                stroke="#00d9ff"
                fillOpacity={1}
                fill="url(#colorPackets)"
                strokeWidth={2}
                dot={{ fill: '#00d9ff', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TrafficChart;
