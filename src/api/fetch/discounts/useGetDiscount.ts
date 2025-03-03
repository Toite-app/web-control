import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IDiscount } from "@/types/discount.types";

export const useGetDiscount = buildApiHook<
  { discountId: string },
  IDiscount,
  unknown,
  unknown
>({
  url: "/discounts/{discountId}",
  method: "GET",
  tags: [ApiCacheTag.DISCOUNTS],
});
