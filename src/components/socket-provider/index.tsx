"use client";

import { useEffect } from "react";
import { useSocketStore } from "@/store/socket";

export default function SocketProvider() {
  const connect = useSocketStore((state) => state.connect);
  const instance = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (instance) return;
    connect();
  }, [connect, instance]);

  return <></>;
}
