import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDispatcherOrder } from "@/types/order.types";

export type IReturnOrderDish = {
  quantity: number;
  reason: string;
};

export const returnOrderDishMutation = buildApiMutation<
  { orderId: string; orderDishId: string },
  IDispatcherOrder,
  unknown,
  IReturnOrderDish
>({
  url: "/orders/{orderId}/dishes/{orderDishId}/return",
  method: "POST",
  tags: [
    ApiCacheTag.ORDERS,
    ApiCacheTag.ORDER_MENU_DISHES,
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
  ],
});
