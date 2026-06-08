import { useState, useEffect, useRef } from 'react';

export const useRefresh = (fetchFunction, interval = 2000, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval
    intervalRef.current = setInterval(fetchData, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, dependencies);

  const retry = () => {
    fetchData();
  };

  return { data, loading, error, retry, refetch: fetchData };
};

export default useRefresh;
