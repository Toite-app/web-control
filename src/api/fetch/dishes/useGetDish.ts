import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IDish } from "@/types/dish.types";

export const useGetDish = buildApiHook<
  {
    dishId: string;
  },
  IDish,
  unknown,
  unknown
>({
  url: "/dishes/{dishId}",
  method: "GET",
  tags: [ApiCacheTag.DISHES],
});
