import { useState, useCallback } from 'react';

export const useSCOUT = () => {
  const [schemes, setSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchemes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.VITE_API_URL}/schemes`);
      const data = await response.json();
      setSchemes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeSchemes = useCallback(async (businessData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.VITE_API_URL}/scout/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { schemes, isLoading, error, fetchSchemes, analyzeSchemes };
};

export default useSCOUT;
