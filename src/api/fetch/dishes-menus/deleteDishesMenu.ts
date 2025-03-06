import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";

export const deleteDishesMenuMutation = buildApiMutation<
  { dishesMenuId: string },
  unknown,
  unknown,
  unknown
>({
  url: "/dishes-menus/{dishesMenuId}",
  method: "DELETE",
  tags: [ApiCacheTag.DISHES_MENUS],
});
