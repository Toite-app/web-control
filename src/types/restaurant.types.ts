import { DayOfWeek } from "@/types/general.types";

export interface IRestaurant {
  id: string;
  name: string;
  legalEntity: string;
  address: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isEnabled: boolean;
  isClosedForever: boolean;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IRestaurantHour {
  id: string; // Unique identifier of the restaurant hours
  restaurantId: string; // Unique identifier of the restaurant
  dayOfWeek: DayOfWeek; // Day of the week for hours
  openingTime: string; // Opening time for hours
  closingTime: string; // Closing time for hours
  isEnabled: boolean; // Is the restaurant enabled?
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
}

export interface IRestaurantWorkshop {
  id: string; // Unique identifier of the workshop
  restaurantId: string; // Unique identifier of the restaurant
  name: string; // Name of the workshop
  isLabelPrintingEnabled: boolean; // Is label printing enabled for this workshop
  isEnabled: boolean; // Is workshop enabled
  createdAt: Date; // Timestamp when workshop was created
  updatedAt: Date; // Timestamp when workshop was updated
}
