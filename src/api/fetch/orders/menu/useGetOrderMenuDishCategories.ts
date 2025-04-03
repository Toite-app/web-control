import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IDishCategory } from "@/types/dish-category.types";

export const useGetOrderMenuDishCategories = buildApiHook<
  { orderId: string },
  IDishCategory[],
  unknown,
  unknown
>({
  url: "/orders/{orderId}/menu/categories",
  method: "GET",
  tags: [ApiCacheTag.DISH_CATEGORIES],
});
