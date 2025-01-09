import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IGuest } from "@/types/guest.types";

export type ICreateGuest = Pick<
  IGuest,
  "name" | "phone" | "email" | "bonusBalance"
> & {
  password: string;
};

export const createGuestMutation = buildApiMutation<
  unknown,
  unknown,
  unknown,
  ICreateGuest
>({
  url: "/guests",
  method: "POST",
  tags: [ApiCacheTag.GUESTS],
});
