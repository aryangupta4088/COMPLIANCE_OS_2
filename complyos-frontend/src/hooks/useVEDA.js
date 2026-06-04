import { useState, useCallback } from 'react';

export const useVEDA = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadDocument = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${process.env.VITE_API_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setDocuments((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeDocument = useCallback(async (documentId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.VITE_API_URL}/veda/analyze/${documentId}`, {
        method: 'POST',
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

  return { documents, isLoading, error, uploadDocument, analyzeDocument };
};

export default useVEDA;
