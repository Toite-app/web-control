import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IRestaurantWorkshop } from "@/types/restaurant.types";

export type IPutRestaurantWorkshop = Partial<
  Pick<IRestaurantWorkshop, "name" | "isLabelPrintingEnabled" | "isEnabled">
>;

export const putRestaurantWorkshopMutation = buildApiMutation<
  { restaurantId: string; workshopId: string },
  unknown,
  unknown,
  IPutRestaurantWorkshop
>({
  url: "/restaurants/{restaurantId}/workshops/{workshopId}",
  method: "PUT",
  tags: [ApiCacheTag.RESTAURANTS],
});
