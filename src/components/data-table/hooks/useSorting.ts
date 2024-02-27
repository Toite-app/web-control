import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { SortingState } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { TanstackUpdater } from "@/types/tanstack.types";

export type SortingUpdater = TanstackUpdater<SortingState>;

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export type UseSortingOptions = object;

export const useSorting = (options?: UseSortingOptions) => {
  const {} = options || {};

  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString);

  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsStringEnum<SortOrder>(Object.values(SortOrder)).withDefault(
      SortOrder.ASC
    )
  );

  const state = useMemo<SortingState>(() => {
    if (!sortBy) return [];

    return [
      {
        id: sortBy,
        desc: sortOrder === SortOrder.DESC,
      },
    ];
  }, [sortBy, sortOrder]);

  const onChange = useCallback(
    (updaterOrValue: SortingUpdater | SortingState) => {
      let _state: SortingState | null = null;

      // Checking if the argument is a function or direct state value
      if (typeof updaterOrValue === "function") {
        _state = updaterOrValue(state);
      } else {
        _state = updaterOrValue;
      }

      // Updating the page and size values based on the new state
      if (_state.length === 0) {
        setSortBy(null);
        setSortOrder(null);
      }

      if (_state?.[0]?.id) {
        setSortBy(_state[0].id);
        setSortOrder(_state[0].desc ? SortOrder.DESC : SortOrder.ASC);
      }
    },
    [setSortBy, setSortOrder, state]
  );

  return {
    sortBy,
    sortOrder,
    state,
    onChange,
  };
};
