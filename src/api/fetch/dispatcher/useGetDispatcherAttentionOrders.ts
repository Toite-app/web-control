import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag, PaginatedResponse } from "@/api/types";
import { IDispatcherOrder, OrderType } from "@/types/order.types";

export type GetOrdersParams = {
  cursorId?: string;
  limit?: number;
  type?: OrderType;
};

export const useGetDispatcherAttentionOrders = buildApiHook<
  string,
  PaginatedResponse<IDispatcherOrder>,
  GetOrdersParams,
  unknown
>({
  url: "/dispatcher/orders/attention-required",
  method: "GET",
  tags: [ApiCacheTag.DISPATCHER_ATTENTION_ORDERS],
});
