import { parseAsJson, useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { TanstackUpdater } from "@/types/tanstack.types";

export type FiltersState = {
  id: string;
  value: unknown;
}[];

export type FiltersUpdater = TanstackUpdater<FiltersState>;

export type UseFiltersOptions = {
  id?: string | null;
  initialFilters?: FiltersState;
};

// Runtime parser to validate the filters structure
const validateFilters = (value: unknown): FiltersState => {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is { id: string; value: unknown } => {
    return (
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      typeof item.id === "string" &&
      "value" in item
    );
  });
};

export const useFilters = (options?: UseFiltersOptions) => {
  const { id, initialFilters = [] } = options || {};

  // Create URL parameter key based on table ID
  const filterKey = id ? `filters_${id}` : "filters";

  const [filters, setFilters] = useQueryState(
    filterKey,
    parseAsJson(validateFilters).withDefault(initialFilters)
  );

  // Memoize the state to prevent unnecessary re-renders
  const state = useMemo(() => filters || [], [filters]);

  const onChange = useCallback(
    (updaterOrValue: FiltersUpdater | FiltersState) => {
      let _state: FiltersState | null = null;

      // Check if the argument is a function or direct state value
      if (typeof updaterOrValue === "function") {
        _state = updaterOrValue(state);
      } else {
        _state = updaterOrValue;
      }

      // Update filters in URL
      if (_state.length === 0) {
        setFilters(null);
      } else {
        setFilters(_state);
      }
    },
    [state, setFilters]
  );

  // Helper function to get a specific filter value by ID
  const getFilterValue = useCallback(
    (filterId: string) => {
      const filter = state.find((f) => f.id === filterId);
      return filter?.value;
    },
    [state]
  );

  // New setFilter callback
  const setFilter = useCallback(
    (filterId: string, value: unknown) => {
      const currentState = [...state];
      const existingFilterIndex = currentState.findIndex(
        (f) => f.id === filterId
      );

      if (value === undefined || value === null) {
        // Remove filter if value is undefined or null
        if (existingFilterIndex !== -1) {
          currentState.splice(existingFilterIndex, 1);
        }
      } else {
        // Update or add filter
        if (existingFilterIndex !== -1) {
          currentState[existingFilterIndex] = { id: filterId, value };
        } else {
          currentState.push({ id: filterId, value });
        }
      }

      if (currentState.length === 0) {
        setFilters(null);
      } else {
        setFilters(currentState);
      }
    },
    [state, setFilters]
  );

  return {
    state,
    onChange,
    getFilterValue,
    setFilter,
  };
};
