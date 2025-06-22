import { useState, useEffect } from 'react';

const useStreams = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStreams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/streams');
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
