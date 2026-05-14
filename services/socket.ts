import { io } from "socket.io-client";

const SOCKET_URL = "http://YOUR_IP:PORT";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],

  autoConnect: false,
});