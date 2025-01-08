import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IRestaurant } from "@/types/restaurant.types";

export type ICreateRestaurant = Pick<
  IRestaurant,
  | "name"
  | "legalEntity"
  | "address"
  | "latitude"
  | "longitude"
  | "timezone"
  | "isEnabled"
  | "isClosedForever"
>;

export const createRestaurantMutation = buildApiMutation<
  { restaurantId: string },
  unknown,
  unknown,
  ICreateRestaurant
>({
  url: "/restaurants",
  method: "POST",
  tags: [ApiCacheTag.RESTAURANTS],
});
