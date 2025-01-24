import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDispatcherOrder, IOrder } from "@/types/order.types";

export type ICreateOrder = Pick<IOrder, "type"> &
  Partial<
    Pick<
      IOrder,
      | "tableNumber"
      | "note"
      | "guestName"
      | "guestPhone"
      | "guestsAmount"
      | "restaurantId"
      | "delayedTo"
    >
  >;

export const createOrderMutation = buildApiMutation<
  unknown,
  IDispatcherOrder,
  unknown,
  ICreateOrder
>({
  url: "/orders",
  method: "POST",
  tags: [
    ApiCacheTag.ORDERS,
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
  ],
});
