import { ManagerOptions, Socket, SocketOptions, io } from "socket.io-client";
import { create } from "zustand";

export interface SocketStore {
  socket: Socket | null;
  status: "connected" | "connecting" | null;
  connect: () => void;
}

export const socketStore = create<SocketStore>((set, get) => ({
  socket: null,
  status: null,
  connect: () => {
    if (get().socket) return;

    const opts: Partial<ManagerOptions & SocketOptions> = {
      transports: ["websocket", "polling"],
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1_000,
    };

    const socket =
      process.env.NODE_ENV === "production"
        ? io(opts)
        : io("http://localhost:6701", opts);

    socket.on("connect", () => {
      set({
        status: "connected",
      });
    });

    socket.on("disconnect", () => {
      set({
        status: null,
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
  const instance = useSocketStore((state) => state.socket);

  return instance;
};
