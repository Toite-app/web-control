"use client";

import { ApiCacheTag } from "@/api/types";
import useSubscription from "@/hooks/use-subscription";
import { mutate } from "swr";

export default function KitchenOrdersSocket() {
  useSubscription(
    {
      id: "",
      type: "NEW_ORDERS",
    },

    (data) => {
      if (data.type !== "NEW_ORDER") return;

      mutate(
        (key) => {
          if (typeof key !== "object" || !Array.isArray(key)) return false;

          const keys = key as string[];

          if (keys.includes(`${ApiCacheTag.KITCHENER_ORDERS}`)) {
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

  return null;
}
