import React from 'react';
import { FiBell, FiAlertTriangle, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export const AlertsPanel = ({ alerts, loading, error, onRetry }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
      case 'high_single_source':
      case 'traffic_spike':
        return { bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger', icon: FiAlertTriangle };
      case 'warning':
      case 'medium':
      case 'unusual_sources':
        return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', icon: FiAlertCircle };
      case 'info':
      case 'high_volume':
        return { bg: 'bg-neon-blue/10', border: 'border-neon-blue/30', text: 'text-neon-blue', icon: FiBell };
      default:
        return { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success', icon: FiCheckCircle };
    }
  };

  const formattedAlerts = Array.isArray(alerts) ? alerts : [];

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiBell className="text-neon-pink" />
          Active Alerts
        </h3>
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

  return (
    <div className="relative bg-gradient-to-br from-dark-surface/80 to-dark-surface-light/50 border border-dark-surface-light/50 rounded-lg p-6 backdrop-blur-xl hover:border-neon-blue/50 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiBell className="text-neon-pink" />
            Active Alerts
          </h3>
          <p className="text-xs text-gray-400 mt-1">Real-time anomaly detection</p>
        </div>
        <div className="px-3 py-1 bg-danger/20 rounded-full">
          <span className="text-xs font-bold text-danger">{formattedAlerts.length} Alert{formattedAlerts.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gradient-to-r from-dark-surface to-dark-surface-light rounded-lg animate-pulse" />
          ))}
        </div>
      ) : formattedAlerts.length > 0 ? (
        <div className="space-y-3">
          {formattedAlerts.map((alert, idx) => {
            const { bg, border, text, icon: IconComponent } = getSeverityColor(alert.type || alert.severity);
            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${bg} ${border} hover:border-opacity-100 transition-all duration-300 cursor-pointer transform hover:scale-102`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-dark-surface ${text}`}>
                    <IconComponent size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className={`font-semibold text-sm ${text}`}>
                          {alert.type ? alert.type.replace(/_/g, ' ').toUpperCase() : 'Alert'}
                        </h4>
                        <p className="text-xs text-gray-300 mt-1">
                          {alert.message || alert.description || 'Anomaly detected in network traffic'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${text === 'text-danger' ? 'bg-danger animate-pulse' : 'bg-warning'}`}></div>
                      </div>
                    </div>
                    {alert.details && (
                      <div className="text-xs text-gray-400 mt-2 px-2 py-1 bg-dark-surface/50 rounded">
                        {alert.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48">
          <FiCheckCircle className="text-success text-4xl mb-2" />
          <p className="text-gray-400">No active alerts</p>
          <p className="text-xs text-gray-500 mt-1">System operating normally</p>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
