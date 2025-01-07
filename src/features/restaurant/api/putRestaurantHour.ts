import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IRestaurantHour } from "@/types/restaurant.types";

export type IPutRestaurantHour = Partial<
  Pick<
    IRestaurantHour,
    "dayOfWeek" | "openingTime" | "closingTime" | "isEnabled"
  >
>;

export const putRestaurantHourMutation = buildApiMutation<
  { restaurantId: string; hourId: string },
  unknown,
  unknown,
  IPutRestaurantHour
>({
  url: "/restaurants/{restaurantId}/hours/{hourId}",
  method: "PUT",
  tags: [ApiCacheTag.RESTAURANTS],
});
