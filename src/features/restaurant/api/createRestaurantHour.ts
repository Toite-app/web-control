import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IRestaurantHour } from "@/types/restaurant.types";

export type ICreateRestaurantHour = Pick<
  IRestaurantHour,
  "dayOfWeek" | "openingTime" | "closingTime" | "isEnabled"
>;

export const createRestaurantHourMutation = buildApiMutation<
  string,
  unknown,
  unknown,
  ICreateRestaurantHour
>({
  url: "/restaurants/{restaurantId}/hours",
  method: "POST",
  tags: [ApiCacheTag.RESTAURANTS],
});
