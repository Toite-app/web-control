import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export const forceReadyOrderDishMutation = buildApiMutation<
  { orderId: string; orderDishId: string },
  unknown,
  unknown,
  unknown
>({
  url: "/orders/{orderId}/dishes/{orderDishId}/force-ready",
  method: "POST",
  tags: [
    ApiCacheTag.ORDERS,
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
  ],
});
