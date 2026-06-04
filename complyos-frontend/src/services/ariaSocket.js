import io from 'socket.io-client';

let socket = null;

export const initializeAriaSocket = () => {
  if (socket) return socket;

  socket = io(process.env.VITE_SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Connected to ARIA WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from ARIA WebSocket');
  });

  socket.on('error', (error) => {
    console.error('ARIA WebSocket error:', error);
  });

  return socket;
};

export const sendAriaMessage = (message) => {
  if (!socket) {
    console.error('Socket not initialized. Call initializeAriaSocket first.');
    return;
  }
  socket.emit('aria:message', message);
};

export const onAriaResponse = (callback) => {
  if (!socket) {
    console.error('Socket not initialized. Call initializeAriaSocket first.');
    return;
  }
  socket.on('aria:response', callback);
};

export const onAriaError = (callback) => {
  if (!socket) {
    console.error('Socket not initialized. Call initializeAriaSocket first.');
    return;
  }
  socket.on('aria:error', callback);
};

export const disconnectAriaSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getAriaSocket = () => socket;
