import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo } from "react";
import { PaginationState } from "@tanstack/react-table";

type Updater = (prev: PaginationState) => PaginationState;

export type UsePaginationOptions = {
  pageIndex: number;
  pageSize: number;
};

export const usePagination = (options?: UsePaginationOptions) => {
  const { pageIndex = 0, pageSize = 10 } = options || {};

  const [page, setPage] = useQueryState("page");
  const [size, setSize] = useQueryState("rowsPerPage");

  const state = useMemo(() => {
    return {
      pageIndex: parseInt(page || pageIndex.toString()),
      pageSize: parseInt(size || pageSize.toString()),
    } as PaginationState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const onChange = useCallback(
    (updaterOrValue: Updater | PaginationState) => {
      let _state: PaginationState | null = null;

      if (typeof updaterOrValue === "function") {
        _state = updaterOrValue(state);
      } else {
        _state = updaterOrValue;
      }

      setPage(_state.pageIndex.toString());
      setSize(_state.pageSize.toString());
    },
    [state, setPage, setSize]
  );

  useEffect(() => {
    if (!page || !size) return;

    if (isNaN(parseInt(page)) || parseInt(page) < 0) {
      setPage(pageIndex.toString());
    }

    if (isNaN(parseInt(size)) || parseInt(size) < 0) {
      setSize(pageSize.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, setPage, setSize]);

  return {
    state,
    onChange,
  };
};
