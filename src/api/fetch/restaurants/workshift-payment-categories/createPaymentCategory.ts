import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IWorkshiftPaymentCategory } from "@/types/restaurant.types";

export type ICreatePaymentCategory = Partial<
  Pick<IWorkshiftPaymentCategory, "name" | "parentId" | "description" | "type">
>;

export const createRestaurantWorkshiftPaymentCategoryMutation =
  buildApiMutation<
    { restaurantId: string },
    IWorkshiftPaymentCategory,
    unknown,
    ICreatePaymentCategory
  >({
    url: "/restaurants/{restaurantId}/workshift-payment-categories",
    method: "POST",
    tags: [ApiCacheTag.RESTAURANT_WORKSHIFT_PAYMENT_CATEGORIES],
  });
