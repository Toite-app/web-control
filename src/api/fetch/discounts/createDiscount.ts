import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDiscount } from "@/types/discount.types";

export type ICreateDiscount = Omit<
  IDiscount,
  "id" | "createdAt" | "updatedAt" | "restaurants"
> & {
  restaurantIds: string[];
};

export const createDiscountMutation = buildApiMutation<
  unknown,
  IDiscount,
  unknown,
  ICreateDiscount
>({
  url: "/discounts",
  method: "POST",
  tags: [ApiCacheTag.DISCOUNTS],
});
