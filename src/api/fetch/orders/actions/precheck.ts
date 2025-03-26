import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IOrderPrecheck } from "@/types/order-history.types";

export const precheckOrderMutation = buildApiMutation<
  { orderId: string },
  IOrderPrecheck,
  unknown,
  unknown
>({
  url: "/orders/{orderId}/actions/precheck",
  method: "POST",
  tags: [
    ApiCacheTag.DISPATCHER_ORDERS,
    ApiCacheTag.DISPATCHER_ATTENTION_ORDERS,
    ApiCacheTag.DISPATCHER_DELAYED_ORDERS,
    ApiCacheTag.ORDERS,
    ApiCacheTag.ORDER_AVAILABLE_ACTIONS,
  ],
});
