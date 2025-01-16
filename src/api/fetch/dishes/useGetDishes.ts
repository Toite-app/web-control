import { buildApiHook } from "@/api/builder/hook";
import {
  ApiCacheTag,
  FilterParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
} from "@/api/types";
import { IDish } from "@/types/dish.types";

export type GetDishesParams = PaginationParams &
  SortingParams &
  FilterParams & {
    search?: string;
  };

export const useGetDishes = buildApiHook<
  string,
  PaginatedResponse<IDish>,
  GetDishesParams,
  unknown
>({
  url: "/dishes",
  method: "GET",
  tags: [ApiCacheTag.DISHES],
});
