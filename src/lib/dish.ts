import { IDish } from "@/types/dish.types";

export default class DishLib {
  public static getDishMainImage(dish: IDish) {
    return dish.images.sort((a, b) => a.sortIndex - b.sortIndex)?.[0];
  }
}
