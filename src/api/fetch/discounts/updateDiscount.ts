import { buildApiMutation } from "@/api/builder/mutation";
import { ICreateDiscount } from "@/api/fetch/discounts/createDiscount";
import { ApiCacheTag } from "@/api/types";
import { IDiscount } from "@/types/discount.types";

export type IUpdateDiscount = Partial<ICreateDiscount>;

export const updateDiscountMutation = buildApiMutation<
  { discountId: string },
  IDiscount,
  unknown,
  IUpdateDiscount
>({
  url: "/discounts/{discountId}",
  method: "PATCH",
  tags: [ApiCacheTag.DISCOUNTS],
});
