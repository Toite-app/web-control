import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IRestaurant } from "@/types/restaurant.types";

export type ICreateRestaurant = Pick<
  IRestaurant,
  "name" | "legalEntity" | "address" | "latitude" | "longitude" | "isEnabled"
>;

export const createRestaurantMutation = buildApiMutation<
  string,
  unknown,
  unknown,
  ICreateRestaurant
>({
  url: "/restaurants",
  method: "POST",
  tags: [ApiCacheTag.RESTAURANTS],
});
