import { buildApiHook } from "@/api/builder/hook";
import {
  ApiCacheTag,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
} from "@/api/types";
import { IRestaurant } from "@/types/restaurant.types";

export type GetRestaurantsParams = PaginationParams & SortingParams;

export const useGetRestaurants = buildApiHook<
  unknown,
  PaginatedResponse<IRestaurant>,
  GetRestaurantsParams,
  unknown
>({
  url: "/restaurants",
  method: "GET",
  tags: [ApiCacheTag.RESTAURANTS],
});
