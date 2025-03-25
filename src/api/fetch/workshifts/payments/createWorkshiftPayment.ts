import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export type ICreateWorkshiftPayment = {
  categoryId: string;
  amount: string;
  note: string | null;
};

export const createWorkshiftPaymentMutation = buildApiMutation<
  { workshiftId: string },
  unknown,
  unknown,
  ICreateWorkshiftPayment
>({
  url: "/workshifts/{workshiftId}/payments",
  method: "POST",
  tags: [ApiCacheTag.WORKSHIFT_PAYMENTS],
});
