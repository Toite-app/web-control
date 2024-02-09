import { buildApiHook } from "@/api/builder/hook";
import { IWorker } from "@/types/worker.types";

const url = "/auth/user" as const;
const method = "GET" as const;

export const useAuth = buildApiHook<string, IWorker, unknown, unknown>({
  url,
  method,
  config: {
    refreshInterval: 60_000,
  },
});
