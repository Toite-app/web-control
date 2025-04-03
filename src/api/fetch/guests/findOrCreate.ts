import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IGuest } from "@/types/guest.types";

export type IFindOrCreateGuest = Pick<IGuest, "phone">;

export const findOrCreateGuestMutation = buildApiMutation<
  unknown,
  IGuest,
  unknown,
  IFindOrCreateGuest
>({
  url: "/guests/find-or-create",
  method: "POST",
  tags: [ApiCacheTag.GUESTS],
});
