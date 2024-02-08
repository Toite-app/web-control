import { useMemo } from "react";
import { useAuth } from "../api/useAuth";

export type SessionStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export const useSession = () => {
  const data = useAuth();

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
    isValidating: data.isValidating,
    mutate: data.mutate,
  };
};
