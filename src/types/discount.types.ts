import { DayOfWeek } from "@/types/general.types";
import { OrderFrom, OrderType } from "@/types/order.types";

export interface IDiscountRestaurant {
  restaurantId: string;
  restaurantName: string;
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
  applyForFirstOrder: boolean;
  applyByPromocode: boolean;
  applyByDefault: boolean;
  isEnabled: boolean;
  startHour: number | null;
  endHour: number | null;
  activeFrom: Date;
  activeTo: Date;
  restaurants: IDiscountRestaurant[];
  createdAt: Date;
  updatedAt: Date;
}
