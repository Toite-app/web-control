import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export const putWorkshopWorkersMutation = buildApiMutation<
  { restaurantId: string; workshopId: string },
  unknown,
  unknown,
  {
    workerIds: string[];
  }
>({
  url: "/restaurants/{restaurantId}/workshops/{workshopId}/workers",
  method: "PUT",
  tags: [ApiCacheTag.RESTAURANTS],
});
