import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDishModifier } from "@/types/dish-modifier.types";

export type ICreateDishModifier = Pick<IDishModifier, "name" | "isActive">;

export const createRestaurantDishModifierMutation = buildApiMutation<
  { restaurantId: string },
  IDishModifier,
  unknown,
  ICreateDishModifier
>({
  url: "/restaurants/{restaurantId}/dish-modifiers",
  method: "POST",
  tags: [ApiCacheTag.RESTAURANT_DISH_MODIFIERS],
});
