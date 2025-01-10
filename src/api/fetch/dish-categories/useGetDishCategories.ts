import { buildApiHook } from "@/api/builder/hook";
import {
  ApiCacheTag,
  FilterParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
} from "@/api/types";
import { IDishCategory } from "@/types/dish-category.types";

export type GetDishCategoriesParams = PaginationParams &
  SortingParams &
  FilterParams;

export const useGetDishCategories = buildApiHook<
  string,
  PaginatedResponse<IDishCategory>,
  GetDishCategoriesParams,
  unknown
>({
  url: "/dish-categories",
  method: "GET",
  tags: [ApiCacheTag.DISH_CATEGORIES],
});
