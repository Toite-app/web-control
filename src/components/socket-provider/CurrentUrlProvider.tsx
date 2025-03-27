"use client";

import { useSocketStore } from "@/store/socket";
import { GatewayIncomingMessage } from "@/types/socket.types";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SocketCurrentUrlProvider() {
  const pathname = usePathname();
  const socket = useSocketStore((state) => state.socket);
  const status = useSocketStore((state) => state.status);

  useEffect(() => {
    if (!socket || status !== "connected") return;

    socket.emit(GatewayIncomingMessage.CURRENT_PATHNAME, {
      pathname,
    });
  }, [socket, status, pathname]);

  return null;
}
