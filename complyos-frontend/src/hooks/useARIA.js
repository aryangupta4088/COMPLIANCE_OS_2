import { useEffect, useRef, useState } from "react";

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

export function useARIA(sessionId) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/aria/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "token") {
          setMessages(prev => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (!last || last.role !== "ai" || !last.streaming) {
              next.push({ id: crypto.randomUUID(), role: "ai", text: data.content, streaming: true });
            } else {
              last.text += data.content;
            }
            return next;
          });
        }
        if (data.type === "profile_complete") {
          return data.data;
        }
      } catch {}
    };

    return () => ws.close();
  }, [sessionId]);

  const sendMessage = (text) => {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify({ message: text }));
    }
  };

  return { connected, messages, setMessages, sendMessage };
}
