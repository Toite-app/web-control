import { ICurrency } from "@/types/general.types";
import { WorkshiftPaymentCategoryType } from "@/types/restaurant.types";
import { IWorker } from "@/types/worker.types";

export interface IWorkshiftPaymentCategory {
  parentId: string | null;
  name: string;
  parent: {
    name: string;
  } | null;
}

export interface IWorkshiftPaymentWorker
  extends Pick<IWorker, "id" | "name" | "role"> {}

export interface IWorkshiftPayment {
  id: string;
  categoryId: string;
  category: IWorkshiftPaymentCategory;
  type: WorkshiftPaymentCategoryType;
  note: string | null;
  amount: string;
  currency: ICurrency;
  workshiftId: string;
  workerId: string;
  worker: IWorkshiftPaymentWorker;
  removedByWorkerId: string | null;
  removedByWorker: IWorkshiftPaymentWorker | null;
  isRemoved: boolean;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}
