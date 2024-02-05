import { PaginationState } from "@tanstack/react-table";
import { useCallback, useState } from "react";

type Updater = (prev: PaginationState) => PaginationState;

export type UsePaginationOptions = {
  pageIndex: number;
  pageSize: number;
};

export const usePagination = (options?: UsePaginationOptions) => {
  const { pageIndex = 0, pageSize = 10 } = options || {};

  const [state, setState] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  const onChange = useCallback((updaterOrValue: Updater | PaginationState) => {
    if (typeof updaterOrValue === "function") {
      setState((prev) => updaterOrValue(prev));
    } else {
      setState(updaterOrValue);
    }
  }, []);

  return {
    state,
    onChange,
  };
};
