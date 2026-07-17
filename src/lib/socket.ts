import { io, Socket } from "socket.io-client";
import { getApiBase } from "./api";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(getApiBase(), { autoConnect: true, reconnection: true });
  }
  return socket;
}
