"use client";

import { ApiCacheTag } from "@/api/types";
import useDebouncedValue from "@/hooks/use-debounced-value";
import useSubscription from "@/hooks/use-subscription";
import { mutate } from "swr";

type Props = {
  orderIds?: string[];
};

const mutateDispatcherOrders = () => {
  mutate(
    (key) => {
      if (typeof key !== "object" || !Array.isArray(key)) return false;

      const keys = key as string[];

      if (keys.includes(`${ApiCacheTag.DISPATCHER_ORDERS}`)) {
        return true;
      }

      if (keys.includes(`${ApiCacheTag.DISPATCHER_DELAYED_ORDERS}`)) {
        return true;
      }

      if (keys.includes(`${ApiCacheTag.DISPATCHER_ATTENTION_ORDERS}`)) {
        return true;
      }

      return false;
    },
    undefined,
    {
      revalidate: true,
    }
  );
};

export default function DispatcherOrdersSocket() {
  useSubscription(
    {
      id: "",
      type: "NEW_ORDERS",
    },
    (data) => {
      if (data.type !== "NEW_ORDER") return;

      mutateDispatcherOrders();
    }
  );

  return null;
}

export function DispatcherSpecificOrdersSocket({ orderIds }: Props) {
  const debouncedOrderIds = useDebouncedValue(orderIds, 2000);

  useSubscription(
    debouncedOrderIds && debouncedOrderIds.length > 0
      ? {
          id: "",
          type: "ORDERS_UPDATE",
          data: {
            orderIds: debouncedOrderIds,
          },
        }
      : undefined,
    (data) => {
      if (data.type !== "ORDER") return;

      mutateDispatcherOrders();
    }
  );

  return null;
}
