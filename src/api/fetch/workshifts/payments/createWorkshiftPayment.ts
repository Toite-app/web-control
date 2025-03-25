import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { ICurrency } from "@/types/general.types";

export type ICreateWorkshiftPayment = {
  categoryId: string;
  amount: string;
  currency: ICurrency;
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
