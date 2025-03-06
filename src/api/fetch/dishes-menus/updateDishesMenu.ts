import { buildApiMutation } from "@/api/builder/mutation";
import { ICreateDishesMenu } from "@/api/fetch/dishes-menus/createDishesMenu";
import { ApiCacheTag } from "@/api/types";

export type IUpdateDishesMenu = Partial<ICreateDishesMenu>;

export const updateDishesMenuMutation = buildApiMutation<
  { dishesMenuId: string },
  unknown,
  unknown,
  IUpdateDishesMenu
>({
  url: "/dishes-menus/{dishesMenuId}",
  method: "PATCH",
  tags: [ApiCacheTag.DISHES_MENUS],
});
