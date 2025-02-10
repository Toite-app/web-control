"use client";

import { useEffect } from "react";
import { useSocketStore } from "@/store/socket";

export default function SocketProvider() {
  const connect = useSocketStore((state) => state.connect);

  useEffect(() => {
    connect();
  }, [connect]);

  return <></>;
}
