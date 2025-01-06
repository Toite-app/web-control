import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IRestaurantHours } from "@/types/restaurant.types";

export type GetRestaurantHoursParams = unknown;

export const useGetRestaurantHours = buildApiHook<
  string,
  IRestaurantHours[],
  GetRestaurantHoursParams,
  unknown
>({
  url: "/restaurants/{restaurantId}/hours",
  method: "GET",
  tags: [ApiCacheTag.RESTAURANTS],
});
