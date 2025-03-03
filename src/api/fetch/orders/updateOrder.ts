import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDispatcherOrder, IOrder } from "@/types/order.types";

export type IUpdateOrder = Partial<
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
    | "paymentMethodId"
  >
>;

export const updateOrderMutation = buildApiMutation<
  { orderId: string },
  IDispatcherOrder,
  unknown,
  IUpdateOrder
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
