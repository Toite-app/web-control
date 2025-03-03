import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IPaymentMethod } from "@/types/payment-method.types";

export const useGetRestaurantPaymentMethods = buildApiHook<
  { restaurantId: string },
  IPaymentMethod[],
  unknown,
  unknown
>({
  url: "/restaurants/{restaurantId}/payment-methods",
  method: "GET",
  tags: [ApiCacheTag.RESTAURANT_PAYMENT_METHODS],
});
