import { buildApiMutation } from "@/api/builder/mutation";
import { ApiCacheTag } from "@/api/types";
import { IDishesMenu } from "@/types/dishes-menu.types";

export type ICreateDishesMenu = Pick<IDishesMenu, "name"> & {
  restaurantIds: string[];
  ownerId?: string;
};

export const createDishesMenuMutation = buildApiMutation<
  unknown,
  unknown,
  unknown,
  ICreateDishesMenu
>({
  url: "/dishes-menus",
  method: "POST",
  tags: [ApiCacheTag.DISHES_MENUS],
});
