import { FilterCondition } from "@/components/data-table/components/filters/index.types";

export function buildFiltersParam<T extends Record<string, any>>(
  filters: { field: keyof T; condition: `${FilterCondition}`; value: string }[]
): string {
  return JSON.stringify(filters);
}
