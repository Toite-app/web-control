export enum WorkerRole {
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  CHIEF_ADMIN = "CHIEF_ADMIN",
  ADMIN = "ADMIN",
  KITCHENER = "KITCHENER",
  WAITER = "WAITER",
  CASHIER = "CASHIER",
  DISPATCHER = "DISPATCHER",
  COURIER = "COURIER",
}

export interface IWorker {
  id: string;
  name: string;
  login: string;
  restaurants: {
    restaurantId: string;
    restaurantName: string;
  }[];
  role: WorkerRole;
  isBlocked: boolean;
  hiredAt: string | null;
  firedAt: string | null;
  onlineAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type IWorkshopWorker = Pick<IWorker, "name" | "login" | "role"> & {
  workerId: IWorker["id"];
};
