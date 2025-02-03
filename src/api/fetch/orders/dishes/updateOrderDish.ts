import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDispatcherOrder } from "@/types/order.types";

export type IUpdateOrderDish = {
  quantity: number;
};

export const updateOrderDishMutation = buildApiMutation<
  { orderId: string; orderDishId: string },
  IDispatcherOrder,
  unknown,
  IUpdateOrderDish
>({
  url: "/orders/{orderId}/dishes/{orderDishId}",
  method: "PATCH",
  tags: [
    ApiCacheTag.ORDERS,
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
  ],
});
