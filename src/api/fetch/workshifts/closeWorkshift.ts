import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export const closeWorkshiftMutation = buildApiMutation<
  { workshiftId: string },
  unknown,
  unknown,
  unknown
>({
  url: "/workshifts/{workshiftId}/close",
  method: "POST",
  tags: [ApiCacheTag.WORKSHIFTS],
});
