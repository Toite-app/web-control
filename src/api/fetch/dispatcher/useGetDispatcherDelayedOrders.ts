import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag, PaginatedResponse } from "@/api/types";
import { IDispatcherOrder, OrderType } from "@/types/order.types";

export type GetOrdersParams = {
  cursorId?: string;
  limit?: number;
  type?: OrderType;
};

export const useGetDispatcherDelayedOrders = buildApiHook<
  string,
  PaginatedResponse<IDispatcherOrder>,
  GetOrdersParams,
  unknown
>({
  url: "/dispatcher/orders/delayed",
  method: "GET",
  tags: [ApiCacheTag.DISPATCHER_DELAYED_ORDERS],
});
