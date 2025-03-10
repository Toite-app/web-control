import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export const updateOrderDishModifiersMutation = buildApiMutation<
  { orderId: string; orderDishId: string },
  unknown,
  {
    dishModifierIds: string[];
  },
  unknown
>({
  url: "/orders/{orderId}/dishes/{orderDishId}/modifiers",
  method: "PUT",
  tags: [
    ApiCacheTag.ORDERS,
    ApiCacheTag.ORDER_MENU_DISHES,
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
  ],
});
