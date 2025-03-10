import { buildApiHook } from "@/api/builder/hook";
import {
  ApiCacheTag,
  CursorPaginatedResponse,
  CursorPaginationParams,
} from "@/api/types";
import { IOrderMenuDish } from "@/types/order.types";

export type GetOrderMenuDishesParams = CursorPaginationParams & {
  search?: string;
  categoryId?: string;
};

export const useGetOrderMenuDishes = buildApiHook<
  { orderId: string },
  CursorPaginatedResponse<IOrderMenuDish>,
  GetOrderMenuDishesParams,
  unknown
>({
  url: "/orders/{orderId}/menu/dishes",
  method: "GET",
  tags: [ApiCacheTag.ORDER_MENU_DISHES],
});
