export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    size: number;
    offset: number;
    total: number;
  };
};
