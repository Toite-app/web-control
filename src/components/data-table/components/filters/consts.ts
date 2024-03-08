import { FilterCondition } from "./index.types";

export const FILTER_CONDITIONS = [
  {
    value: FilterCondition.Equals,
    label: "table.filter.conditions.equals",
  },
  {
    value: FilterCondition.NotEquals,
    label: "table.filter.conditions.notEquals",
  },
  {
    value: FilterCondition.Contains,
    label: "table.filter.conditions.contains",
  },
  {
    value: FilterCondition.NotContains,
    label: "table.filter.conditions.notContains",
  },
  {
    value: FilterCondition.StartsWith,
    label: "table.filter.conditions.startsWith",
  },
  {
    value: FilterCondition.EndsWith,
    label: "table.filter.conditions.endsWith",
  },
];
