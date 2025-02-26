import { ICurrency } from "@/types/general.types";

export type OrderType = "delivery" | "takeaway" | "hall" | "banquet";

export type OrderStatus =
  | "pending"
  | "cooking"
  | "ready"
  | "delivering"
  | "paid"
  | "completed"
  | "cancelled";

export type OrderFrom = "app" | "website" | "internal";

export interface IOrder {
  id: string;
  number: string;
  tableNumber: string;
  type: OrderType;
  status: OrderStatus;
  currency: ICurrency;
  from: OrderFrom;
  note: string | null;
  guestName: string | null;
  guestPhone: string | null;
  guestsAmount: number | null;
  subtotal: string;
  discountAmount: string;
  surchargeAmount: string;
  bonusUsed: string;
  total: string;
  isHiddenForGuest: boolean;
  isRemoved: boolean;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
  delayedTo: Date | null;
  guestId: string | null;
  restaurantId: string | null;
  restaurantName: string | null;
  orderDishes: IOrderDish[];
  cookingAt?: Date;
  readyAt?: Date;
  paidAt?: Date;
  completedAt?: Date;
}

export type OrderDishStatus = "pending" | "cooking" | "ready" | "completed";

export interface IOrderDishModifier {
  id: string;
  name: string;
}

export interface IOrderDish {
  id: string;
  orderId: string;
  name: string;
  dishId: string;
  status: OrderDishStatus;
  modifiers: IOrderDishModifier[];
  quantity: number;
  quantityReturned: number;
  price: string;
  finalPrice: string;
  isRemoved: boolean;
  isAdditional: boolean;
  createdAt: Date;
  updatedAt: Date;
  cookingAt?: Date;
  readyAt?: Date;
}

export interface IDispatcherOrderDish
  extends Pick<IOrderDish, "status" | "isRemoved"> {}

export type IDispatcherOrder = Omit<IOrder, "orderDishes"> & {
  orderDishes: IDispatcherOrderDish[];
};

export interface IKitchenerOrderDish
  extends Pick<
    IOrderDish,
    | "id"
    | "name"
    | "status"
    | "quantity"
    | "quantityReturned"
    | "isAdditional"
    | "modifiers"
    | "cookingAt"
    | "readyAt"
  > {
  workshops: {
    id: string;
    name: string;
    isMyWorkshop: boolean;
  }[];
  cookingTimeInMin: number;
  isReadyOnTime: boolean;
}

export type IKitchenerOrder = Pick<
  IOrder,
  | "id"
  | "number"
  | "tableNumber"
  | "type"
  | "from"
  | "note"
  | "status"
  | "guestsAmount"
  | "createdAt"
  | "updatedAt"
  | "delayedTo"
  | "cookingAt"
  | "readyAt"
> & {
  orderDishes: IKitchenerOrderDish[];
};

export interface IOrderAvailableActions {
  canPrecheck: boolean;
  canCalculate: boolean;
  canSendToKitchen: boolean;
}
