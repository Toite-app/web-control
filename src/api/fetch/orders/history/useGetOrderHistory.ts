import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag, PaginatedResponse, PaginationParams } from "@/api/types";
import { IOrderHistory } from "@/types/order-history.types";

export type GetOrderHistoryParams = PaginationParams;

export const useGetOrderHistory = buildApiHook<
  { orderId: string },
  PaginatedResponse<IOrderHistory>,
  GetOrderHistoryParams,
  unknown
>({
  url: "/orders/{orderId}/history",
  method: "GET",
  tags: ({ urlValues }) => [
    ApiCacheTag.ORDER_HISTORY,
    `${ApiCacheTag.ORDER_HISTORY}:${urlValues?.orderId}`,
  ],
});
