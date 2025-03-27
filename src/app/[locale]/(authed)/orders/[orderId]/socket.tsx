"use client";

import { ApiCacheTag } from "@/api/types";
import useSubscription from "@/hooks/use-subscription";
import { mutate } from "swr";

type Props = {
  orderId: string;
};

export default function OrderSocket({ orderId }: Props) {
  useSubscription(
    {
      id: "",
      type: "ORDERS_UPDATE",
      data: {
        orderIds: [orderId],
      },
    },
    (data) => {
      if (data.type !== "ORDER") return;

      mutate(
        (key) => {
          if (typeof key !== "object" || !Array.isArray(key)) return false;

          const keys = key as string[];

          return keys.includes(`${ApiCacheTag.ORDERS}:${data.orderId}`);
        },
        undefined,
        {
          revalidate: true,
        }
      );
    }
  );

  return null;
}
