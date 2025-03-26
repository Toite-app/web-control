import { CurrencyEnum } from "@/types/general.types";
import { IOrder, OrderType } from "@/types/order.types";
import { IWorker } from "@/types/worker.types";

export interface IOrderPrecheckPosition {
  id: string;
  precheckId: string;
  name: string;
  quantity: number;
  price: string;
  discountAmount: string;
  surchargeAmount: string;
  finalPrice: string;
}

export interface IOrderPrecheck {
  id: string;
  orderId: string;
  workerId: string;
  type: `${OrderType}`;
  legalEntity: string;
  locale: "en" | "ru" | "ee";
  currency: `${CurrencyEnum}`;
  createdAt: string;
  positions: IOrderPrecheckPosition[];
  worker: Pick<IWorker, "name" | "role">;
  order: Pick<IOrder, "number">;
}
