import { IFile } from "@/types/file.types";
import { ICurrency } from "@/types/general.types";

export enum WeightMeasure {
  grams = "grams",
  milliliters = "milliliters",
}

export interface IDishImage extends IFile {
  sortIndex: number;
  alt: string;
}

export interface IDish {
  id: string;
  name: string;
  note: string;
  cookingTimeInMin: number;
  amountPerItem: number;
  weight: number;
  weightMeasure: WeightMeasure;
  isLabelPrintingEnabled: boolean;
  printLabelEveryItem: number;
  isPublishedInApp: boolean;
  isPublishedAtSite: boolean;
  images: IDishImage[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDishDto = Omit<IDish, "id" | "createdAt" | "updatedAt">;

export type UpdateDishDto = Partial<CreateDishDto>;

export interface IDishPricelistWorkshop {
  workshopId: string;
  workshopName: string;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface IDishPricelistItem {
  restaurantId: string;
  restaurantName: string;
  workshops: IDishPricelistWorkshop[];
  price: number;
  currency: ICurrency;
  isInStoplist: boolean;
}

export interface IUpdateDishPricelist {
  price: number;
  currency: ICurrency;
  isInStoplist: boolean;
  workshopIds: string[];
}
