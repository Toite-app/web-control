import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDispatcherOrder } from "@/types/order.types";

export const markOrderDishAsReadyMutation = buildApiMutation<
  { orderId: string; orderDishId: string },
  IDispatcherOrder,
  unknown,
  unknown
>({
  url: "/kitchener/orders/{orderId}/dishes/{orderDishId}/ready",
  method: "POST",
  tags: [
    ApiCacheTag.ORDERS,
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
    ApiCacheTag.KITCHENER_ORDERS,
  ],
});
