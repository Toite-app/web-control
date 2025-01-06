import { buildApiHook } from "@/api/builder/hook";
import {
  ApiCacheTag,
  FilterParams,
  PaginationParams,
  SortingParams,
} from "@/api/types";

export type GetWorkersParams = PaginationParams & SortingParams & FilterParams;

export type AddressSuggestionsParams = {
  query: string;
  provider?: "dadata" | "google";
  language?: string;
  includeRaw?: boolean;
};

export interface AddressSuggestion {
  value: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const useAddressSuggestions = buildApiHook<
  string,
  AddressSuggestion[],
  AddressSuggestionsParams,
  unknown
>({
  url: "/addresses/suggestions",
  method: "GET",
  tags: [ApiCacheTag.ADDRESS_SUGGESTIONS],
});
