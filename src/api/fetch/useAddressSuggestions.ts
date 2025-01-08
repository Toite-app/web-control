import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";

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
  unknown,
  AddressSuggestion[],
  AddressSuggestionsParams,
  unknown
>({
  url: "/addresses/suggestions",
  method: "GET",
  tags: [ApiCacheTag.ADDRESS_SUGGESTIONS],
});
