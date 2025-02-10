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
      type: "ORDER",
      data: {
        orderId,
      },
    },
    (data) => {
      if (data.type !== "ORDER") return;

      mutate((key) => {
        if (typeof key !== "object" || !Array.isArray(key)) return false;

        const keys = key as string[];

        console.log(keys);

        return keys.includes(`${ApiCacheTag.ORDERS}:${data.order.id}`);
      }, data.order);
    }
  );

  return null;
}
