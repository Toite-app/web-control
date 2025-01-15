import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export type IUpdateDishImage = {
  alt?: string;
  sortIndex?: number;
};

export const updateDishImageMutation = buildApiMutation<
  {
    dishId: string;
    imageId: string;
  },
  unknown,
  unknown,
  IUpdateDishImage
>({
  url: "/dishes/{dishId}/images/{imageId}",
  method: "PUT",
  tags: [ApiCacheTag.DISHES],
});
