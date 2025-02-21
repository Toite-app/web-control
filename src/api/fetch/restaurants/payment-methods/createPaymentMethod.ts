import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IPaymentMethod } from "@/types/payment-method.types";

export type ICreatePaymentMethod = Pick<
  IPaymentMethod,
  "name" | "type" | "icon"
> &
  Partial<Pick<IPaymentMethod, "secretId" | "isActive">> & {
    secretKey?: string;
  };

export const createRestaurantPaymentMethodMutation = buildApiMutation<
  { restaurantId: string },
  IPaymentMethod,
  unknown,
  ICreatePaymentMethod
>({
  url: "/restaurants/{restaurantId}/payment-methods",
  method: "POST",
  tags: [ApiCacheTag.RESTAURANT_PAYMENT_METHODS],
});
