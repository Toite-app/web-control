import { UserRole } from "@/api/fetch/useAuthedUser";
import { buildApiHook } from "@/api/hook-builder";
import { PaginatedResponse } from "@/api/types";

export type Worker = {
  id: number;
  name: string | null;
  restaurantId: number | null;
  login: string;
  role: UserRole;
  isBlocked: boolean;
  hiredAt: string | null;
  firedAt: string | null;
  onlineAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetWorkersPayload = any;

export const useGetWorkers = buildApiHook<
  PaginatedResponse<Worker>,
  GetWorkersPayload,
  string
>({
  url: "/workers",
  method: "GET",
});
