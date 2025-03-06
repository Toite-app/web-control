import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IDishesMenu } from "@/types/dishes-menu.types";

export type GetDishesMenusParams = unknown;

export const useGetDishesMenus = buildApiHook<
  string,
  IDishesMenu[],
  GetDishesMenusParams,
  unknown
>({
  url: "/dishes-menus",
  method: "GET",
  tags: [ApiCacheTag.DISHES_MENUS],
});
