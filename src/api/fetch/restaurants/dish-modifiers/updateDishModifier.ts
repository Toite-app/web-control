import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDishModifier } from "@/types/dish-modifier.types";

export type IUpdateDishModifier = Pick<IDishModifier, "name" | "isActive">;

export const updateRestaurantDishModifierMutation = buildApiMutation<
  { restaurantId: string; dishModifierId: string },
  IDishModifier,
  unknown,
  IUpdateDishModifier
>({
  url: "/restaurants/{restaurantId}/dish-modifiers/{dishModifierId}",
  method: "PUT",
  tags: [ApiCacheTag.RESTAURANT_DISH_MODIFIERS],
});
