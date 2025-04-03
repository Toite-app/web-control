import { IDishesMenu } from "@/types/dishes-menu.types";
import { DayOfWeek } from "@/types/general.types";
import { OrderFrom, OrderType } from "@/types/order.types";

export interface IDiscountRestaurant {
  restaurantId: string;
  restaurantName: string;
}

export interface IDiscountConnection {
  dishesMenuId: string;
  dishesMenu: IDishesMenu;
  restaurantIds: string[];
  dishCategoryIds: string[];
}

export interface IDiscount {
  id: string;
  name: string;
  description: string;
  percent: number;
  orderFroms: OrderFrom[];
  orderTypes: OrderType[];
  daysOfWeek: DayOfWeek[];
  promocode: string | null;
  applyOnlyAtFirstOrder: boolean;
  applyOnlyByPromocode: boolean;
  isEnabled: boolean;
  startTime: string | null;
  endTime: string | null;
  activeFrom: Date;
  activeTo: Date;
  restaurants: IDiscountRestaurant[];
  connections?: IDiscountConnection[];
  createdAt: Date;
  updatedAt: Date;
}
