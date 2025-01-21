import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag, PaginatedResponse, PaginationParams } from "@/api/types";
import { IOrder } from "@/types/order.types";

export type GetOrdersParams = PaginationParams;

export const useGetOrders = buildApiHook<
  string,
  PaginatedResponse<IOrder>,
  GetOrdersParams,
  unknown
>({
  url: "/orders",
  method: "GET",
  tags: [ApiCacheTag.ORDERS],
});
