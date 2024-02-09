import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IWorker } from "@/types/worker.types";

export type IPutWorker = Partial<
  Pick<
    IWorker,
    | "name"
    | "login"
    | "restaurantId"
    | "role"
    | "isBlocked"
    | "hiredAt"
    | "firedAt"
  >
>;

export const putWorkerMutation = buildApiMutation<
  "id",
  unknown,
  unknown,
  IPutWorker
>({
  url: "/workers/{id}",
  method: "PUT",
  tags: [ApiCacheTag.WORKERS],
});
