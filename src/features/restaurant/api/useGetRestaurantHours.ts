import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IRestaurantHour } from "@/types/restaurant.types";

export type GetRestaurantHoursParams = unknown;

export const useGetRestaurantHours = buildApiHook<
  { restaurantId: string },
  IRestaurantHour[],
  GetRestaurantHoursParams,
  unknown
>({
  url: "/restaurants/{restaurantId}/hours",
  method: "GET",
  tags: [ApiCacheTag.RESTAURANTS],
});
