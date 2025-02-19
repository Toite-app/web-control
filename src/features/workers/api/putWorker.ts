import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IWorker } from "@/types/worker.types";

export type IPutWorker = Partial<
  Pick<IWorker, "name" | "login" | "role" | "isBlocked" | "hiredAt" | "firedAt">
> & {
  restaurants: {
    restaurantId: string;
  }[];
};

export const putWorkerMutation = buildApiMutation<
  { id: string },
  unknown,
  unknown,
  IPutWorker
>({
  url: "/workers/{id}",
  method: "PUT",
  tags: [ApiCacheTag.WORKERS],
});
