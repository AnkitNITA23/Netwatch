import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const unwrapAlerts = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload?.active_alerts || [];
};

const unwrapHistory = (payload) => {
  if (Array.isArray(payload)) return payload;
  return payload?.history || [];
};

export const apiService = {
  // Dashboard overview
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/traffic');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },

  // Statistics
  getStats: async () => {
    try {
      const response = await apiClient.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Alerts
  getAlerts: async () => {
    try {
      const response = await apiClient.get('/alerts');
      return unwrapAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  // Stats history
  getStatsHistory: async () => {
    try {
      const response = await apiClient.get('/stats_history');
      return unwrapHistory(response.data);
    } catch (error) {
      console.error('Error fetching stats history:', error);
      throw error;
    }
  },

  // Database status
  getDBStatus: async () => {
    try {
      const response = await apiClient.get('/db_status');
      return response.data;
    } catch (error) {
      console.error('Error fetching DB status:', error);
      throw error;
    }
  },

  // Chart data from stats history snapshots
  getChartData: async () => {
    try {
      const history = await apiService.getStatsHistory();
      const labels = history.map((item) =>
        new Date(item.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      ).slice(-20);
      const values = history.map((item) => item.total_packets).slice(-20);

      return { labels, values };
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  },

  // Sniffer status
  getSnifferStatus: async () => {
    try {
      const response = await apiClient.get('/sniffer_status');
      return response.data;
    } catch (error) {
      console.error('Error fetching sniffer status:', error);
      throw error;
    }
  },

  // Simulate traffic (for testing)
  simulateTraffic: async (ip) => {
    try {
      const response = await apiClient.get(`/simulate_traffic?ip=${ip}`);
      return response.data;
    } catch (error) {
      console.error('Error simulating traffic:', error);
      throw error;
    }
  },

  // Persist current traffic snapshot to MongoDB
  saveTraffic: async () => {
    try {
      const response = await apiClient.post('/save_traffic');
      return response.data;
    } catch (error) {
      console.error('Error saving traffic:', error);
      throw error;
    }
  },

  // Load persisted traffic records from MongoDB
  loadTraffic: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/load_traffic?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error loading traffic:', error);
      throw error;
    }
  },
};

export default apiService;
