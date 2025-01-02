"use client";

import { AddFilterButton } from "./components/AddButton";
import { ActiveFilters } from "./components/ActiveFilters";
import { Filter } from "./index.types";
import {
  FilterValue,
  useFilters,
} from "@/components/data-table/hooks/useFilters";

export type DataTableFiltersProps<F extends string> = {
  tableId?: string | null;
  config: Filter<F>[];
};

export const DataTableFilters = <F extends string>(
  props: DataTableFiltersProps<F>
) => {
  const { config, tableId } = props;

  const filters = useFilters({
    id: tableId,
    fields: config,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-1">
        <AddFilterButton
          config={filters.availableFields}
          onAdd={(field, value, condition) => {
            filters.addFilter(field as F, value, condition);
          }}
        />
      </div>
      <ActiveFilters
        filters={filters.state as Record<string, FilterValue>}
        fields={filters.fields}
        onRemove={(field) => filters.removeFilter(field as F)}
        onClear={filters.clearFilters}
      />
    </div>
  );
};
