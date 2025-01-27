import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDispatcherOrder } from "@/types/order.types";

export type ICreateOrderDish = {
  dishId: string;
  quantity: number;
};

export const createOrderDishMutation = buildApiMutation<
  { orderId: string },
  IDispatcherOrder,
  unknown,
  ICreateOrderDish
>({
  url: "/orders/{orderId}/dishes",
  method: "POST",
  tags: [
    ApiCacheTag.ORDERS,
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
  ],
});
