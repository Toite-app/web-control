import { useSocketStore } from "@/store/socket";
import {
  ClientSubscription,
  GatewayIncomingMessage,
  IncomingSubscription,
} from "@/types/socket.types";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useSubscription(
  subscription: Omit<ClientSubscription, "id">
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

    return () => {
      socket.emit(GatewayIncomingMessage.SUBSCRIPTION, {
        id,
        ...subscription,
        action: "unsubscribe",
      } satisfies IncomingSubscription);
    };
  }, [socket, status, subscription]);
}
