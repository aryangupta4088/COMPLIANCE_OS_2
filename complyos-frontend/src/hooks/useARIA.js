import { useState, useCallback } from 'react';
import { useNotificationStore } from '../store/notificationStore';

export const useARIA = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const sendMessage = useCallback(async (message) => {
    setIsLoading(true);
    setError(null);
    try {
      // API call to ARIA agent will be added here
      const response = await fetch(`${process.env.VITE_API_URL}/aria/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'user', content: message }, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setError(err.message);
      addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Failed to send message to ARIA',
        read: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
};

export default useARIA;
