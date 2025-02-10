import { Socket, io } from "socket.io-client";
import { create } from "zustand";

export interface SocketStore {
  socket: Socket | null;
  status: "connected" | "connecting" | null;
  connect: () => void;
}

export const socketStore = create<SocketStore>((set, get) => ({
  socket: null,
  status: null,
  cacheKeys: new Set(),
  sentCacheKeys: new Set(),
  connect: () => {
    if (get().socket) return;

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:6701",
      {
        transports: ["websocket", "polling"],
        autoConnect: true,
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1_000,
      }
    );

    socket.on("connect", () => {
      set({
        status: "connected",
      });
    });

    set({
      socket,
      status: "connecting",
    });
  },
}));

export const useSocketStore = socketStore;
export const socket = socketStore.getState().socket;

export const useSocket = () => {
  return useSocketStore((state) => state.socket);
};
