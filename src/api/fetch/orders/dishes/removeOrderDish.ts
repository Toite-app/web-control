import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDispatcherOrder } from "@/types/order.types";

export const removeOrderDishMutation = buildApiMutation<
  { orderId: string; orderDishId: string },
  IDispatcherOrder,
  unknown,
  unknown
>({
  url: "/orders/{orderId}/dishes/{orderDishId}",
  method: "DELETE",
  tags: [
    ApiCacheTag.ORDERS,
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
  ],
});
