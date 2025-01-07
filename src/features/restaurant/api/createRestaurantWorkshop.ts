import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IRestaurantWorkshop } from "@/types/restaurant.types";

export type ICreateRestaurantWorkshop = Pick<
  IRestaurantWorkshop,
  "name" | "isLabelPrintingEnabled" | "isEnabled"
>;

export const createRestaurantWorkshopMutation = buildApiMutation<
  { restaurantId: string },
  unknown,
  unknown,
  ICreateRestaurantWorkshop
>({
  url: "/restaurants/{restaurantId}/workshops",
  method: "POST",
  tags: [ApiCacheTag.RESTAURANTS],
});
