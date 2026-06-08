import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';
import { apiService } from './services/apiService';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [backendError, setBackendError] = useState(null);
  const [checkingBackend, setCheckingBackend] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const checkBackend = async () => {
    try {
      setCheckingBackend(true);
      await apiService.getStats();
      setBackendError(null);
    } catch (err) {
      setBackendError(err.message || 'Unable to connect to the NetWatch backend');
    } finally {
      setCheckingBackend(false);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (checkingBackend) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="text-gray-400">Connecting to NetWatch...</p>
      </div>
    );
  }

  if (backendError) {
    return <ErrorPage error={backendError} onRetry={checkBackend} />;
  }

  return (
    <MainLayout theme={theme} onThemeToggle={handleThemeToggle}>
      <Dashboard />
    </MainLayout>
  );
}

export default App;
