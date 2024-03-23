import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('localhost:3000', { autoConnect: false });
export const useSocket = () => {
  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};
