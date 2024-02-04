import { useAuthedUser } from "@/api/fetch/useAuthedUser";
import { useMemo } from "react";

export type SessionStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export const useSession = () => {
  const data = useAuthedUser({
    config: {
      refreshInterval: 60_000,
    },
  });

  const userData = useMemo(() => data.data, [data.data]);
  const error = useMemo(() => data.error, [data.error]);

  const status = useMemo<SessionStatus>(() => {
    if (data.isLoading) return "loading";

    if (data.error && data.error.response?.status !== 401) {
      return "error";
    }

    if (!data.data?.id) return "unauthenticated";

    return "authenticated";
  }, [data]);

  return {
    data: userData,
    status,
    error,
    mutate: data.mutate,
  };
};
