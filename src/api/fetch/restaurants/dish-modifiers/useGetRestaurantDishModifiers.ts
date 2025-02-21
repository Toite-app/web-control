import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IDishModifier } from "@/types/dish-modifier.types";

export const useGetRestaurantDishModifiers = buildApiHook<
  {
    restaurantId: string;
  },
  IDishModifier[],
  unknown,
  unknown
>({
  url: "/restaurants/{restaurantId}/dish-modifiers",
  method: "GET",
  tags: [ApiCacheTag.RESTAURANTS, ApiCacheTag.RESTAURANT_DISH_MODIFIERS],
});
