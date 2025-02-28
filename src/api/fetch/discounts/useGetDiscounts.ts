import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IDiscount } from "@/types/discount.types";

export type GetDiscountsParams = unknown;

export const useGetDiscounts = buildApiHook<
  string,
  IDiscount[],
  GetDiscountsParams,
  unknown
>({
  url: "/discounts",
  method: "GET",
  tags: [ApiCacheTag.DISCOUNTS],
});
