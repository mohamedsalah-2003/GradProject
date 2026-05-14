import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/env";


let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: {
      token,
    },
    forceNew: true,
  });

  socket.on("connect", () => {
    console.log("SOCKET CONNECTED:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("SOCKET DISCONNECTED");
  });

  socket.on("connect_error", (err) => {
    console.log("SOCKET ERROR:", err);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not connected");
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};