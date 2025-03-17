import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IWorkshiftPaymentCategory } from "@/types/restaurant.types";

export type IUpdatePaymentCategory = Partial<
  Pick<IWorkshiftPaymentCategory, "name" | "description" | "isActive">
>;

export const updateRestaurantWorkshiftPaymentCategoryMutation =
  buildApiMutation<
    { restaurantId: string; categoryId: string },
    IWorkshiftPaymentCategory,
    unknown,
    IUpdatePaymentCategory
  >({
    url: "/restaurants/{restaurantId}/workshift-payment-categories/{categoryId}",
    method: "PATCH",
    tags: [ApiCacheTag.RESTAURANT_WORKSHIFT_PAYMENT_CATEGORIES],
  });
