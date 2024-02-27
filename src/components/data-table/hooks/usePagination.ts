import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo } from "react";
import { PaginationState } from "@tanstack/react-table";
import { TanstackUpdater } from "@/types/tanstack.types";

// Defining a type for the updater function
export type PaginationUpdater = TanstackUpdater<PaginationState>;

// Defining type for options that can be passed to the hook
export type UsePaginationOptions = {
  pageIndex: number;
  pageSize: number;
};

// Custom hook for handling pagination functionality
export const usePagination = (options?: UsePaginationOptions) => {
  // Destructuring the options object with default values
  const { pageIndex = 0, pageSize = 10 } = options || {};

  // Using custom hooks to manage page and size state in URL query params
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(pageIndex)
  );

  const [size, setSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(pageSize)
  );

  // Memoizing the state based on page and size values
  const state = useMemo(() => {
    return {
      pageIndex: page,
      pageSize: size,
    } as PaginationState;
  }, [page, size]);

  // Callback function to handle changes in pagination state
  const onChange = useCallback(
    (updaterOrValue: PaginationUpdater | PaginationState) => {
      let _state: PaginationState | null = null;

      // Checking if the argument is a function or direct state value
      if (typeof updaterOrValue === "function") {
        _state = updaterOrValue(state);
      } else {
        _state = updaterOrValue;
      }

      // Updating the page and size values based on the new state
      setPage(_state.pageIndex);
      setSize(_state.pageSize);
    },
    [state, setPage, setSize]
  );

  // Effect to validate and correct page and size values
  useEffect(() => {
    if (!page || !size) return;

    // Validating and resetting page number if it's not a valid number
    if (isNaN(page) || page < 0) {
      setPage(pageIndex);
    }

    // Validating and resetting page size if it's not a valid number
    if (isNaN(size) || size < 0) {
      setSize(pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, setPage, setSize]);

  // Returning the current pagination state and change handler
  return {
    state,
    onChange,
  };
};
