import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export const sendToKitchenMutation = buildApiMutation<
  { orderId: string },
  unknown,
  unknown,
  unknown
>({
  url: "/orders/{orderId}/actions/send-to-kitchen",
  method: "POST",
  tags: [
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.ORDERS,
    ApiCacheTag.ORDER_AVAILABLE_ACTIONS,
    ApiCacheTag.ORDER_HISTORY,
  ],
});
