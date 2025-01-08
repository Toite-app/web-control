import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";

export type TimezonesParams = {
  query: string;
  provider?: "dadata" | "google";
  language?: string;
  includeRaw?: boolean;
};

export interface TimezonesResponse {
  timezones: string[];
}

export const useGetTimezones = buildApiHook<
  unknown,
  TimezonesResponse,
  TimezonesParams,
  unknown
>({
  url: "/timezones",
  method: "GET",
  tags: [ApiCacheTag.TIMEZONES],
});
