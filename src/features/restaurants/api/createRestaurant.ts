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
  | "currency"
  | "isEnabled"
  | "isClosedForever"
  | "ownerId"
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
