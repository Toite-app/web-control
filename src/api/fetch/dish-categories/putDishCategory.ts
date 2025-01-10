import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDishCategory } from "@/types/dish-category.types";

export type IPutDishCategory = Partial<
  Pick<IDishCategory, "name" | "showForWorkers" | "showForGuests" | "sortIndex">
>;

export const putDishCategoryMutation = buildApiMutation<
  { categoryId: string },
  unknown,
  unknown,
  IPutDishCategory
>({
  url: "/dish-categories/{categoryId}",
  method: "PUT",
  tags: [ApiCacheTag.DISH_CATEGORIES],
});
