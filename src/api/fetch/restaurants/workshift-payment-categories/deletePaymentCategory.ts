import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export const deleteRestaurantWorkshiftPaymentCategoryMutation =
  buildApiMutation<
    { restaurantId: string; categoryId: string },
    unknown,
    unknown,
    unknown
  >({
    url: "/restaurants/{restaurantId}/workshift-payment-categories/{categoryId}",
    method: "DELETE",
    tags: [ApiCacheTag.RESTAURANT_WORKSHIFT_PAYMENT_CATEGORIES],
  });
