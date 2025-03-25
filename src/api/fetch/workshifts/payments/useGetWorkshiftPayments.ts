import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { WorkshiftPaymentCategoryType } from "@/types/restaurant.types";
import { IWorkshiftPayment } from "@/types/workshift-payment.types";

export const useGetWorkshiftPayments = buildApiHook<
  { workshiftId: string },
  IWorkshiftPayment[],
  { types?: `${WorkshiftPaymentCategoryType}`[] },
  unknown
>({
  url: "/workshifts/{workshiftId}/payments",
  method: "GET",
  tags: [ApiCacheTag.WORKSHIFT_PAYMENTS],
});
