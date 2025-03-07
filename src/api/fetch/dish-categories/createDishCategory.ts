import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDishCategory } from "@/types/dish-category.types";

export type ICreateDishCategory = Pick<
  IDishCategory,
  "name" | "showForWorkers" | "showForGuests" | "sortIndex" | "menuId"
>;

export const createDishCategoryMutation = buildApiMutation<
  unknown,
  unknown,
  unknown,
  ICreateDishCategory
>({
  url: "/dish-categories",
  method: "POST",
  tags: [ApiCacheTag.DISH_CATEGORIES],
});
