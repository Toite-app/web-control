import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IUpdateDishPricelist } from "@/types/dish.types";

export const updateDishPricelistMutation = buildApiMutation<
  {
    dishId: string;
    restaurantId: string;
  },
  unknown,
  unknown,
  IUpdateDishPricelist
>({
  url: "/dishes/{dishId}/pricelist/{restaurantId}",
  method: "PUT",
  tags: [ApiCacheTag.DISHES, ApiCacheTag.RESTAURANTS],
});
