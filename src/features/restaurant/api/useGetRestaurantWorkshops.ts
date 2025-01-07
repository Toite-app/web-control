import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IRestaurantWorkshop } from "@/types/restaurant.types";

export type GetRestaurantWorkshopsParams = unknown;

export const useGetRestaurantWorkshops = buildApiHook<
  { restaurantId: string },
  IRestaurantWorkshop[],
  GetRestaurantWorkshopsParams,
  unknown
>({
  url: "/restaurants/{restaurantId}/workshops",
  method: "GET",
  tags: [ApiCacheTag.RESTAURANTS],
});
