import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag, PaginatedResponse } from "@/api/types";
import { IWorker } from "@/types/worker.types";

export type GetWorkersParams = any;

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
