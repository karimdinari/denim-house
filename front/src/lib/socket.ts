import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? import.meta.env.VITE_API_URL ?? "http://localhost:4000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("[socket] connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("[socket] disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("[socket] connection error:", error);
    });
  }

  return socket;
}

export function connectSocket() {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function onSocketEvent<T = any>(event: string, callback: (data: T) => void) {
  const socket = getSocket();
  socket.on(event, callback);
  
  // Return cleanup function
  return () => {
    socket.off(event, callback);
  };
}

export function emitSocketEvent<T = any>(event: string, data?: T) {
  const socket = getSocket();
  socket.emit(event, data);
}
