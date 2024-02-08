import { buildApiHook } from "@/api/builder/hook";

export enum UserRole {
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  CHIEF_ADMIN = "CHIEF_ADMIN",
  ADMIN = "ADMIN",
  KITCHENER = "KITCHENER",
  WAITER = "WAITER",
  CASHIER = "CASHIER",
  DISPATCHER = "DISPATCHER",
  COURIER = "COURIER",
}

export type AuthedUser = {
  id: number;
  name: string;
  login: string;
  role: UserRole;
};

const url = "/auth/user" as const;
const method = "GET" as const;

export const useAuth = buildApiHook<string, AuthedUser, unknown, unknown>({
  url,
  method,
  config: {
    refreshInterval: 60_000,
  },
});
