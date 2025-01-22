import { SortOrder } from "@/components/data-table/hooks/useSorting";

export enum ApiCacheTag {
  WORKERS = "WORKERS",
  GUESTS = "GUESTS",
  RESTAURANTS = "RESTAURANTS",
  ADDRESS_SUGGESTIONS = "ADDRESS_SUGGESTIONS",
  DISH_CATEGORIES = "DISH_CATEGORIES",
  DISHES = "DISHES",
  TIMEZONES = "TIMEZONES",
  ORDERS = "ORDERS",
  DISPATCHER_ORDERS = "DISPATCHER_ORDERS",
}

export type PaginationMeta = {
  page: number;
  size: number;
  offset: number;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type PaginationParams = Partial<{
  page: number;
  size: number;
}>;

export type SortingParams = Partial<{
  sortBy: string;
  sortOrder: SortOrder;
}>;

export type FilterParams = Partial<{
  filters: string;
}>;

export type FieldError<T extends string> = {
  property: T;
  constraints: Record<string, string>;
};

export type ErrorResponse = {
  message: string | FieldError<string>[];
};
