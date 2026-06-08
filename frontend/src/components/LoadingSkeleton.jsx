import React from 'react';

export const LoadingSkeleton = ({ count = 1, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gradient-to-r from-dark-surface to-dark-surface-light rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="h-80 bg-gradient-to-r from-dark-surface to-dark-surface-light rounded-lg animate-pulse" />
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gradient-to-r from-dark-surface to-dark-surface-light rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
