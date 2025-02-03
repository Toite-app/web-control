import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDispatcherOrder, IOrder } from "@/types/order.types";

export type ICreateOrder = Partial<
  Pick<
    IOrder,
    | "type"
    | "tableNumber"
    | "note"
    | "guestName"
    | "guestPhone"
    | "guestsAmount"
    | "restaurantId"
    | "delayedTo"
  >
>;

export const updateOrderMutation = buildApiMutation<
  { orderId: string },
  IDispatcherOrder,
  unknown,
  ICreateOrder
>({
  url: "/orders/{orderId}",
  method: "PATCH",
  tags: [
    ApiCacheTag.ORDERS,
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
  ],
});
