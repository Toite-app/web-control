import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";

export const useGetWorkshiftNav = buildApiHook<
  { workshiftId: string },
  {
    prevId: string | null;
    nextId: string | null;
  },
  unknown,
  unknown
>({
  url: "/workshifts/{workshiftId}/navigation",
  method: "GET",
  tags: [ApiCacheTag.WORKSHIFTS],
});
