import { buildApiHook } from "@/api/builder/hook";
import {
  ApiCacheTag,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
} from "@/api/types";
import { IWorkshift } from "@/types/workshift.types";

export type GetWorkshiftsParams = PaginationParams &
  SortingParams & {
    restaurantId?: string;
  };

export const useGetWorkshifts = buildApiHook<
  string,
  PaginatedResponse<IWorkshift>,
  GetWorkshiftsParams,
  unknown
>({
  url: "/workshifts",
  method: "GET",
  tags: [ApiCacheTag.WORKSHIFTS],
});
