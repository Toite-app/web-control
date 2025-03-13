import { SortOrder } from "@/components/data-table/hooks/useSorting";

export enum ApiCacheTag {
  WORKERS = "WORKERS",
  ORDER_MENU_DISHES = "ORDER_MENU_DISHES",
  GUESTS = "GUESTS",
  RESTAURANTS = "RESTAURANTS",
  RESTAURANT_PAYMENT_METHODS = "RESTAURANT_PAYMENT_METHODS",
  RESTAURANT_DISH_MODIFIERS = "RESTAURANT_DISH_MODIFIERS",
  ADDRESS_SUGGESTIONS = "ADDRESS_SUGGESTIONS",
  DISH_CATEGORIES = "DISH_CATEGORIES",
  DISHES = "DISHES",
  DISHES_MENUS = "DISHES_MENUS",
  TIMEZONES = "TIMEZONES",
  ORDERS = "ORDERS",
  ORDER_AVAILABLE_ACTIONS = "ORDER_AVAILABLE_ACTIONS",
  DISPATCHER_ORDERS = "DISPATCHER_ORDERS",
  DISPATCHER_ATTENTION_ORDERS = "DISPATCHER_ATTENTION_ORDERS",
  DISPATCHER_DELAYED_ORDERS = "DISPATCHER_DELAYED_ORDERS",
  KITCHENER_ORDERS = "KITCHENER_ORDERS",
  DISCOUNTS = "DISCOUNTS",
  WORKSHIFTS = "WORKSHIFTS",
}

export type PaginationMeta = {
  page: number;
  size: number;
  offset: number;
  total: number;
};

export type CursorPaginationMeta = {
  cursorId: string | null;
  limit: number;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type CursorPaginatedResponse<T> = {
  data: T[];
  meta: CursorPaginationMeta;
};

export type PaginationParams = Partial<{
  page: number;
  size: number;
}>;

export type CursorPaginationParams = Partial<{
  cursorId: string | null;
  limit: number;
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
