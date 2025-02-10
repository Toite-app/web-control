import { useSocketStore } from "@/store/socket";
import {
  ClientSubscription,
  GatewayIncomingMessage,
  IncomingSubscription,
  SocketEventData,
  SocketEventType,
} from "@/types/socket.types";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useSubscription(
  subscription: Omit<ClientSubscription, "id">,
  onUpdate?: (data: SocketEventData) => void
) {
  const socket = useSocketStore((state) => state.socket);
  const status = useSocketStore((state) => state.status);

  useEffect(() => {
    if (!socket || status !== "connected") return;

    const id = uuidv4();

    socket.emit(GatewayIncomingMessage.SUBSCRIPTION, {
      id,
      ...subscription,
      action: "subscribe",
    } satisfies IncomingSubscription);

    const listener = (data: SocketEventData) => {
      if (id !== data.id) return;

      onUpdate?.(data);
    };

    if (onUpdate) {
      socket.on(SocketEventType.SUBSCRIPTION_UPDATE, listener);
    }

    return () => {
      if (onUpdate) {
        socket.off(SocketEventType.SUBSCRIPTION_UPDATE, listener);
      }

      socket.emit(GatewayIncomingMessage.SUBSCRIPTION, {
        id,
        ...subscription,
        action: "unsubscribe",
      } satisfies IncomingSubscription);
    };
  }, [socket, status, subscription, onUpdate]);
}
