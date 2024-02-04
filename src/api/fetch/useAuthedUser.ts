import { buildApiHook, buildApiMutation } from "../hook-builder";

export type UserRole =
  | "SYSTEM_ADMIN"
  | "CHIEF_ADMIN"
  | "ADMIN"
  | "KITCHENER"
  | "WAITER"
  | "CASHIER"
  | "DISPATCHER"
  | "COURIER";

export type AuthedUser = {
  id: number;
  name: string;
  login: string;
  role: UserRole;
};

const url = "/auth/user" as const;
const method = "GET" as const;

export const useAuthedUser = buildApiHook<AuthedUser, any, string>({
  url,
  method,
});

export const getAuthedUser = buildApiMutation<AuthedUser, any, string>({
  url,
  method,
});
