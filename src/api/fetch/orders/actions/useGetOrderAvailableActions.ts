import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IOrderAvailableActions } from "@/types/order.types";

export const useGetOrderAvailableActions = buildApiHook<
  { orderId: string },
  IOrderAvailableActions,
  unknown,
  unknown
>({
  url: "/orders/{orderId}/actions/available",
  method: "GET",
  tags: ({ urlValues }) => [
    ApiCacheTag.ORDERS,
    ApiCacheTag.ORDER_AVAILABLE_ACTIONS,
    `${ApiCacheTag.ORDER_AVAILABLE_ACTIONS}:${urlValues?.orderId}`,
  ],
});
