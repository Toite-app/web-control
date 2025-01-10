import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDish } from "@/types/dish.types";

export type IPutDish = Partial<
  Pick<
    IDish,
    | "name"
    | "note"
    | "cookingTimeInMin"
    | "amountPerItem"
    | "weight"
    | "weightMeasure"
    | "isLabelPrintingEnabled"
    | "printLabelEveryItem"
    | "isPublishedInApp"
    | "isPublishedAtSite"
  >
>;

export const putDishMutation = buildApiMutation<
  { dishId: string },
  unknown,
  unknown,
  IPutDish
>({
  url: "/dishes/{dishId}",
  method: "PUT",
  tags: [ApiCacheTag.DISHES],
});
