import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IRestaurant } from "@/types/restaurant.types";

export type IPutRestaurant = Partial<
  Pick<
    IRestaurant,
    | "name"
    | "legalEntity"
    | "address"
    | "latitude"
    | "longitude"
    | "isEnabled"
    | "isClosedForever"
    | "ownerId"
  >
>;

export const putRestaurantMutation = buildApiMutation<
  { id: string },
  unknown,
  unknown,
  IPutRestaurant
>({
  url: "/restaurants/{id}",
  method: "PUT",
  tags: [ApiCacheTag.RESTAURANTS],
});
