import { RestaurantHourDialogProps } from "@/features/restaurant/hour-dialog";
import { RestaurantWorkshopDialogProps } from "@/features/restaurant/workshop-dialog";
import { WorkshopWorkersDialogProps } from "@/features/restaurant/workshop-workers-dialog";
import { IRestaurant } from "@/types/restaurant.types";
import { IWorker } from "@/types/worker.types";
import { create } from "zustand";
import { IGuest } from "@/types/guest.types";
import { IDishCategory } from "@/types/dish-category.types";
import { IDish } from "@/types/dish.types";

export enum DialogType {
  Restaurant = "restaurant",
  RestaurantHour = "restaurantHour",
  RestaurantWorkshop = "restaurantWorkshop",
  RestaurantWorkshopWorkers = "restaurantWorkshopWorkers",
  Worker = "worker",
  Guest = "guest",
  DishCategory = "dishCategory",
  Dish = "dish",
}

// Define data types for each dialog that needs data
export type DialogData = {
  [DialogType.Restaurant]?: IRestaurant;
  [DialogType.Worker]?: IWorker;
  [DialogType.RestaurantHour]?: RestaurantHourDialogProps["data"];
  [DialogType.RestaurantWorkshop]?: RestaurantWorkshopDialogProps["data"];
  [DialogType.RestaurantWorkshopWorkers]?: WorkshopWorkersDialogProps["data"];
  [DialogType.Guest]?: IGuest;
  [DialogType.DishCategory]?: IDishCategory;
  [DialogType.Dish]?: IDish;
};

interface DialogsStore {
  loaded: Set<DialogType>;
  states: {
    type: DialogType | `${DialogType}`;
    isOpen: boolean;
    data?: DialogData[keyof DialogData];
  }[];
  toggle: (
    type: DialogType | `${DialogType}`,
    value?: boolean,
    data?: DialogData[DialogType]
  ) => void;
}

const useDialogsStore = create<DialogsStore>((set) => ({
  loaded: new Set<DialogType>(),
  states: [],
  toggle: (
    type: DialogType | `${DialogType}`,
    value?: boolean,
    data?: DialogData[DialogType]
  ) => {
    set(({ states, loaded }) => {
      const existingState = states.find((state) => state.type === type);
      let newIsOpen = value ?? true;

      if (existingState && value === undefined) {
        newIsOpen = !existingState.isOpen;
      }

      if (newIsOpen) loaded.add(type as DialogType);

      const newStates = existingState
        ? states.map((state) =>
            state.type === type
              ? {
                  ...state,
                  isOpen: newIsOpen,
                  data:
                    !data && newIsOpen === true
                      ? undefined
                      : data ?? state.data,
                }
              : state
          )
        : [...states, { type, isOpen: true, data }];

      return {
        states: newStates,
        loaded,
      };
    });
  },
}));

export default useDialogsStore;
