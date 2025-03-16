import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  roomId: string | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  roomId: null,
  joinRoom: () => {},
  leaveRoom: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

    socketInstance.on('connect', () => {
      console.log('Socket.IO bağlantısı kuruldu');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket.IO bağlantısı kesildi');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinRoom = (newRoomId: string) => {
    if (socket && isConnected) {
      socket.emit('joinRoom', newRoomId);
      setRoomId(newRoomId);
    }
  };

  const leaveRoom = () => {
    if (socket && isConnected && roomId) {
      socket.emit('leaveRoom', roomId);
      setRoomId(null);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, roomId, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};