import { IRestaurant } from "@/types/restaurant.types";
import { IWorker } from "@/types/worker.types";

export enum WorkshiftStatus {
  PLANNED = "PLANNED",
  OPENED = "OPENED",
  CLOSED = "CLOSED",
}

export type TWorkshiftWorker = Pick<IWorker, "id" | "name" | "role">;

export interface IWorkshift {
  id: string;
  status: WorkshiftStatus;
  restaurantId: string;
  restaurant: Pick<IRestaurant, "id" | "name" | "currency">;
  openedByWorkerId: string | null;
  openedByWorker: TWorkshiftWorker | null;
  closedByWorkerId: string | null;
  closedByWorker: TWorkshiftWorker | null;
  openedAt: Date | null;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
