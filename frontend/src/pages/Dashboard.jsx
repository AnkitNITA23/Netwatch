import React, { useState } from 'react';
import { FiGlobe, FiBell, FiPackage } from 'react-icons/fi';
import { BsDatabase } from 'react-icons/bs';

import StatCard from '../components/StatCard';
import TrafficChart from '../components/TrafficChart';
import TopSourcesTable from '../components/TopSourcesTable';
import AlertsPanel from '../components/AlertsPanel';
import DatabaseStatus from '../components/DatabaseStatus';
import SnifferStatus from '../components/SnifferStatus';
import HistoryTimeline from '../components/HistoryTimeline';
import LoadingSkeleton from '../components/LoadingSkeleton';

import { useRefresh } from '../hooks/useRefresh';
import { apiService } from '../services/apiService';

export const Dashboard = () => {
  const [saving, setSaving] = useState(false);

  const { data: stats, loading: statsLoading, error: statsError, retry: retryStats } = useRefresh(
    () => apiService.getStats(),
    2000
  );

  const { data: alerts, loading: alertsLoading, error: alertsError, retry: retryAlerts } = useRefresh(
    () => apiService.getAlerts(),
    2000
  );

  const { data: dbStatus, loading: dbStatusLoading, error: dbStatusError, retry: retryDB } = useRefresh(
    () => apiService.getDBStatus(),
    3000
  );

  const { data: chartData, loading: chartLoading, error: chartError } = useRefresh(
    () => apiService.getChartData(),
    2000
  );

  const { data: history, loading: historyLoading, error: historyError } = useRefresh(
    () => apiService.getStatsHistory(),
    5000
  );

  const { data: snifferStatus, loading: snifferLoading, error: snifferError, retry: retrySniffer } = useRefresh(
    () => apiService.getSnifferStatus(),
    5000
  );

  const totalPackets = stats?.total_packets || 0;
  const uniqueSources = stats?.unique_sources || 0;
  const alertList = Array.isArray(alerts) ? alerts : alerts?.active_alerts || [];
  const activeAlerts = alertList.length;
  const dbConnected = dbStatus?.connected || dbStatus?.status === 'connected';

  const handleSaveSnapshot = async () => {
    try {
      setSaving(true);
      await apiService.saveTraffic();
    } catch (err) {
      console.error('Failed to save snapshot:', err);
    } finally {
      setSaving(false);
    }
  };

  const isInitialLoad = statsLoading && !stats;

  if (isInitialLoad) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Network Dashboard</h1>
          <p className="text-gray-400">Real-time traffic monitoring and anomaly detection</p>
        </div>
        <LoadingSkeleton count={4} type="card" />
        <LoadingSkeleton type="chart" />
        <LoadingSkeleton count={5} type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Network Dashboard</h1>
        <p className="text-gray-400">Real-time traffic monitoring and anomaly detection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FiPackage}
          title="Total Packets"
          value={totalPackets.toLocaleString()}
          subtitle="All packets captured"
          color="neon-blue"
        />
        <StatCard
          icon={FiGlobe}
          title="Unique Sources"
          value={uniqueSources}
          subtitle="Different IP addresses"
          color="neon-purple"
        />
        <StatCard
          icon={FiBell}
          title="Active Alerts"
          value={activeAlerts}
          subtitle="System anomalies"
          color="neon-pink"
        />
        <StatCard
          icon={BsDatabase}
          title="Database"
          value={dbConnected ? 'Online' : 'Offline'}
          subtitle={dbConnected ? 'MongoDB connected' : 'Connection lost'}
          color={dbConnected ? 'success' : 'neon-pink'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficChart data={chartData} loading={chartLoading} error={chartError} />
        </div>
        <div className="space-y-6">
          <DatabaseStatus
            dbStatus={dbStatus}
            loading={dbStatusLoading}
            error={dbStatusError}
            onRetry={retryDB}
            onSave={handleSaveSnapshot}
            saving={saving}
          />
          <SnifferStatus
            snifferStatus={snifferStatus}
            loading={snifferLoading}
            error={snifferError}
            onRetry={retrySniffer}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopSourcesTable
            stats={stats}
            loading={statsLoading}
            error={statsError}
            onRetry={retryStats}
          />
        </div>
        <div>
          <AlertsPanel
            alerts={alertList}
            loading={alertsLoading}
            error={alertsError}
            onRetry={retryAlerts}
          />
        </div>
      </div>

      <div>
        <HistoryTimeline history={history} loading={historyLoading} error={historyError} />
      </div>
    </div>
  );
};

export default Dashboard;
