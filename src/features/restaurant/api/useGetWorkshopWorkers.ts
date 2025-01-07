import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IWorkshopWorker } from "@/types/worker.types";

export const useGetWorkshopWorkers = buildApiHook<
  {
    restaurantId: string;
    workshopId: string;
  },
  IWorkshopWorker[],
  unknown,
  unknown
>({
  url: "/restaurants/{restaurantId}/workshops/{workshopId}/workers",
  method: "GET",
  tags: [ApiCacheTag.RESTAURANTS],
});
