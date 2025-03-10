import { buildApiHook } from "@/api/builder/hook";
import {
  ApiCacheTag,
  CursorPaginatedResponse,
  CursorPaginationParams,
} from "@/api/types";
import { IOrderMenuDish } from "@/types/order.types";

export type GetDishesParams = CursorPaginationParams & unknown;

export const useGetOrderMenuDishes = buildApiHook<
  { orderId: string },
  CursorPaginatedResponse<IOrderMenuDish>,
  GetDishesParams,
  unknown
>({
  url: "/orders/{orderId}/menu/dishes",
  method: "GET",
  tags: [ApiCacheTag.ORDER_DISHES],
});
