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

export type FieldError<T extends string> = {
  property: T;
  constraints: Record<string, string>;
};

export type ErrorResponse = {
  message: string | FieldError<string>[];
};
