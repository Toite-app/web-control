import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export const removeWorkshiftPaymentMutation = buildApiMutation<
  { workshiftId: string; paymentId: string },
  unknown,
  unknown,
  unknown
>({
  url: "/workshifts/{workshiftId}/payments/{paymentId}",
  method: "DELETE",
  tags: [ApiCacheTag.WORKSHIFT_PAYMENTS],
});
