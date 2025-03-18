import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IWorkshift } from "@/types/workshift.types";

export const useGetWorkshift = buildApiHook<
  { workshiftId: string },
  IWorkshift,
  unknown,
  unknown
>({
  url: "/workshifts/{workshiftId}",
  method: "GET",
  tags: [ApiCacheTag.WORKSHIFTS],
});
