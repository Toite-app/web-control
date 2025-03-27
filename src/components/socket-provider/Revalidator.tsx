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
      SocketEventType.REVALIDATE_ORDER,
      (event: SocketRevalidateOrderEvent) => {
        mutate(
          (key) => {
            if (typeof key !== "object" || !Array.isArray(key)) return false;

            const keys = key as string[];

            if (keys.includes(`${ApiCacheTag.ORDERS}:${event.orderId}`)) {
              return true;
            }

            return false;
          },
          undefined,
          {
            revalidate: true,
          }
        );
      }
    );
  }, [socket, status]);

  return null;
}
