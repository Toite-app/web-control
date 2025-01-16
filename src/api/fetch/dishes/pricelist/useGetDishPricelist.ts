import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IDishPricelistItem } from "@/types/dish.types";

export const useGetDishPricelist = buildApiHook<
  {
    dishId: string;
  },
  IDishPricelistItem[],
  unknown,
  unknown
>({
  url: "/dishes/{dishId}/pricelist",
  method: "GET",
  tags: [ApiCacheTag.DISHES, ApiCacheTag.RESTAURANTS],
});
