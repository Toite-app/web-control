import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDish } from "@/types/dish.types";

export type ICreateDish = Pick<
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
>;

export const createDishMutation = buildApiMutation<
  unknown,
  unknown,
  unknown,
  ICreateDish
>({
  url: "/dishes",
  method: "POST",
  tags: [ApiCacheTag.DISHES],
});
