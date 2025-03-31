"use client";

import { ApiCacheTag } from "@/api/types";
import { useSocketStore } from "@/store/socket";
import {
  SocketEventType,
  SocketRevalidateOrderEvent,
} from "@/types/socket.types";
import { useEffect } from "react";
import { mutate } from "swr";

export default function SocketRevalidator() {
  const socket = useSocketStore((state) => state.socket);
  const status = useSocketStore((state) => state.status);

  useEffect(() => {
    if (!socket || status !== "connected") return;

    socket.on(
      SocketEventType.REVALIDATE_ORDER_PAGE,
      (event: SocketRevalidateOrderEvent) => {
        const { orderId } = event;

        mutate(
          (keys) => {
            if (typeof keys !== "object" || !Array.isArray(keys)) return false;

            return keys.includes(`${ApiCacheTag.ORDERS}:${orderId}`);
          },
          undefined,
          { revalidate: true }
        );
      }
    );

    socket.on(SocketEventType.REVALIDATE_DISPATCHER_ORDERS_PAGE, () => {
      mutate((keys) => {
        if (typeof keys !== "object" || !Array.isArray(keys)) return false;

        return (
          keys.includes(`${ApiCacheTag.DISPATCHER_ORDERS}`) ||
          keys.includes(`${ApiCacheTag.DISPATCHER_ATTENTION_ORDERS}`)
        );
      });
    });

    socket.on(SocketEventType.REVALIDATE_KITCHENER_ORDERS_PAGE, () => {
      mutate((keys) => {
        if (typeof keys !== "object" || !Array.isArray(keys)) return false;

        return keys.includes(`${ApiCacheTag.KITCHENER_ORDERS}`);
      });
    });
  }, [socket, status]);

  return null;
}
