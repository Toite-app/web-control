import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IGuest } from "@/types/guest.types";

export type IPutGuest = Partial<
  Pick<IGuest, "name" | "phone" | "email" | "bonusBalance">
>;

export const putGuestMutation = buildApiMutation<
  { guestId: string },
  unknown,
  unknown,
  IPutGuest
>({
  url: "/guests/{guestId}",
  method: "PUT",
  tags: [ApiCacheTag.GUESTS],
});
