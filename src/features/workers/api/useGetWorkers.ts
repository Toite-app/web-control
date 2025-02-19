import { buildApiHook } from "@/api/builder/hook";
import {
  ApiCacheTag,
  FilterParams,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
} from "@/api/types";
import { IWorker } from "@/types/worker.types";

export type GetWorkersParams = PaginationParams &
  SortingParams &
  FilterParams & {
    restaurantIds?: string[];
  };

export const useGetWorkers = buildApiHook<
  string,
  PaginatedResponse<IWorker>,
  GetWorkersParams,
  unknown
>({
  url: "/workers",
  method: "GET",
  tags: [ApiCacheTag.WORKERS],
});
