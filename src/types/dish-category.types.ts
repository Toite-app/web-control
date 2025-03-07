export interface IDishCategory {
  id: string;
  menuId: string;
  name: string;
  showForWorkers: boolean;
  showForGuests: boolean;
  sortIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDishCategoryDto = Omit<
  IDishCategory,
  "id" | "createdAt" | "updatedAt" | "menuId"
>;

export type UpdateDishCategoryDto = Partial<CreateDishCategoryDto>;
