import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";

import { IWorkshiftPaymentCategory } from "@/types/restaurant.types";

export const useGetRestaurantWorkshiftPaymentCategories = buildApiHook<
  {
    restaurantId: string;
  },
  IWorkshiftPaymentCategory[],
  unknown,
  unknown
>({
  url: "/restaurants/{restaurantId}/workshift-payment-categories",
  method: "GET",
  tags: [
    ApiCacheTag.RESTAURANTS,
    ApiCacheTag.RESTAURANT_WORKSHIFT_PAYMENT_CATEGORIES,
  ],
});
