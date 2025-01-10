export interface IDishCategory {
  id: string;
  name: string;
  showForWorkers: boolean;
  showForGuests: boolean;
  sortIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDishCategoryDto = Omit<
  IDishCategory,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateDishCategoryDto = Partial<CreateDishCategoryDto>;
