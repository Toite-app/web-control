import { buildApiHook } from "@/api/builder/hook";
import {
  ApiCacheTag,
  FilterParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
} from "@/api/types";
import { IGuest } from "@/types/guest.types";

export type GetGuestsParams = PaginationParams & SortingParams & FilterParams;

export const useGetGuests = buildApiHook<
  string,
  PaginatedResponse<IGuest>,
  GetGuestsParams,
  unknown
>({
  url: "/guests",
  method: "GET",
  tags: [ApiCacheTag.GUESTS],
});
