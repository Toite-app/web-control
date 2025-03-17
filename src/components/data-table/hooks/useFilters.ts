import { parseAsJson, useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { Filter, FilterCondition } from "../components/filters/index.types";

export type FilterValue = {
  value: string;
  condition: FilterCondition;
};

export type FiltersState<F extends string = string> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [K in F]?: FilterValue;
};

export type UseFiltersOptions<F extends string = string> = {
  id?: string | null;
  initialFilters?: FiltersState<F>;
  fields: Filter<F>[];
};

// Runtime parser to validate the filters structure
const validateFilters = <F extends string>(value: unknown): FiltersState<F> => {
  if (!value || typeof value !== "object") return {};

  const filters: FiltersState<F> = {};
  const obj = value as Record<string, unknown>;

  for (const [field, filterValue] of Object.entries(obj)) {
    if (
      filterValue &&
      typeof filterValue === "object" &&
      "value" in filterValue &&
      typeof (filterValue as any).value === "string" &&
      "condition" in filterValue &&
      Object.values(FilterCondition).includes((filterValue as any).condition)
    ) {
      filters[field as F] = filterValue as FilterValue;
    }
  }

  return filters;
};

export type FilterParams = {
  filters?: string;
};

export const useFilters = <F extends string>(
  options?: UseFiltersOptions<F>
) => {
  const { id, initialFilters = {}, fields = [] } = options || {};

  // Create URL parameter key based on table ID
  const filterKey = id ? `f${id}` : "f";

  const [filters, setFilters] = useQueryState(
    filterKey,
    parseAsJson(validateFilters).withDefault(initialFilters)
  );

  const state = useMemo(() => filters || {}, [filters]);

  const setFilter = useCallback(
    (field: F, value: string | null, condition: FilterCondition) => {
      const currentState = { ...state };

      if (value === null) {
        delete currentState[field];
      } else {
        currentState[field] = {
          value,
          condition,
        };
      }

      if (Object.keys(currentState).length === 0) {
        setFilters(null);
      } else {
        setFilters(currentState);
      }
    },
    [state, setFilters]
  );

  const getFilter = useCallback(
    (field: F) => {
      return state[field];
    },
    [state]
  );

  const clearFilters = useCallback(() => {
    setFilters(null);
  }, [setFilters]);

  // Get available fields for adding new filters
  const availableFields = useMemo(() => {
    return fields.filter((field) => !state[field.field]);
  }, [fields, state]);

  // Add new filter
  const addFilter = useCallback(
    (field: F, value: string, condition: FilterCondition) => {
      const fieldConfig = fields.find((f) => f.field === field);
      if (!fieldConfig) return;

      // Validate condition is allowed for this field
      if (!fieldConfig.conditions.includes(condition)) return;

      setFilter(field, value, condition);
    },
    [fields, setFilter]
  );

  // Remove filter
  const removeFilter = useCallback(
    (field: F) => {
      setFilter(field, null, FilterCondition.Equals);
    },
    [setFilter]
  );

  // Add new getter for API params
  const filterParams = useMemo((): FilterParams => {
    if (Object.keys(state).length === 0) {
      return {};
    }

    return {
      filters: JSON.stringify(
        Object.entries(state).map(([field, filter]) => ({
          field,
          value: filter?.value,
          condition: filter?.condition,
        }))
      ),
    };
  }, [state]);

  return {
    state,
    fields,
    availableFields,
    setFilter,
    getFilter,
    clearFilters,
    addFilter,
    removeFilter,
    filterParams,
  };
};
