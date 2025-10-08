import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const useStreams = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStreams = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/streams`);
        if (!response.ok) {
          throw new Error('Failed to fetch streams');
        }
        const data = await response.json();
        setStreams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getStreams();
  }, []);

  return { streams, loading, error };
};

export default useStreams;
