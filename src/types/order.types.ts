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
}
