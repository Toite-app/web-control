import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag, PaginatedResponse, PaginationParams } from "@/api/types";
import { DispatcherOrder } from "@/types/order.types";

export type GetOrdersParams = {
  cursorId?: string;
  limit?: number;
};

export const useGetDispatcherOrders = buildApiHook<
  string,
  PaginatedResponse<DispatcherOrder>,
  GetOrdersParams,
  unknown
>({
  url: "/dispatcher/orders",
  method: "GET",
  tags: [ApiCacheTag.DISPATCHER_ORDERS],
});
