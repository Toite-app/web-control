import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IRestaurant } from "@/types/restaurant.types";

export type GetRestaurantParams = unknown;

export const useGetRestaurant = buildApiHook<
  { restaurantId: string },
  IRestaurant,
  GetRestaurantParams,
  unknown
>({
  url: "/restaurants/{restaurantId}",
  method: "GET",
  tags: [ApiCacheTag.RESTAURANTS],
});
