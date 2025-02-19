import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IWorker } from "@/types/worker.types";

export type ICreateWorker = Pick<IWorker, "name" | "login" | "role"> & {
  password: string;
  restaurants: {
    restaurantId: string;
  }[];
};

export const createWorkerMutation = buildApiMutation<
  unknown,
  IWorker,
  unknown,
  ICreateWorker
>({
  url: "/workers",
  method: "POST",
  tags: [ApiCacheTag.WORKERS],
});
