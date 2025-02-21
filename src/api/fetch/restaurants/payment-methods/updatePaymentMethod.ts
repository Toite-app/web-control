import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IPaymentMethod } from "@/types/payment-method.types";

export type IUpdatePaymentMethod = Partial<
  Pick<IPaymentMethod, "name" | "icon" | "isActive">
>;

export const updateRestaurantPaymentMethodMutation = buildApiMutation<
  { restaurantId: string; paymentMethodId: string },
  IPaymentMethod,
  unknown,
  IUpdatePaymentMethod
>({
  url: "/restaurants/{restaurantId}/payment-methods/{paymentMethodId}",
  method: "PATCH",
  tags: [ApiCacheTag.RESTAURANT_PAYMENT_METHODS],
});
