import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export type ICreateWorkshift = {
  restaurantId: string;
};

export const createWorkshiftMutation = buildApiMutation<
  unknown,
  unknown,
  unknown,
  ICreateWorkshift
>({
  url: "/workshifts",
  method: "POST",
  tags: [ApiCacheTag.WORKSHIFTS],
});
