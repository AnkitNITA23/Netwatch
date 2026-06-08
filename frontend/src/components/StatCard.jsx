import React from 'react';

export const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'neon-blue' }) => {
  const colorMap = {
    'neon-blue': 'from-neon-blue to-blue-400',
    'neon-purple': 'from-neon-purple to-purple-400',
    'neon-pink': 'from-neon-pink to-pink-400',
    'success': 'from-success to-emerald-400',
  };

  return (
    <div className="group relative h-full">
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colorMap[color]} rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>

      {/* Card */}
      <div className="relative h-full bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl hover:border-neon-blue/50 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${colorMap[color]} bg-clip-text text-transparent`}>
                {value}
              </h3>
              {trend && (
                <span className={`text-xs font-semibold ${trend.direction === 'up' ? 'text-success' : 'text-warning'}`}>
                  {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[color]} text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
            <Icon size={24} />
          </div>
        </div>

        {subtitle && (
          <div className="text-xs text-gray-500">
            {subtitle}
          </div>
        )}

        {/* Animated bottom border */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colorMap[color]} rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`} style={{ width: '100%' }}></div>
      </div>
    </div>
  );
};

export default StatCard;
