import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export const uploadDishImageMutation = buildApiMutation<
  {
    dishId: string;
  },
  unknown,
  unknown,
  FormData
>({
  url: "/dishes/{dishId}/images",
  method: "POST",
  tags: [ApiCacheTag.DISHES],
});
