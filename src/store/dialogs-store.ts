import { RestaurantHourDialogProps } from "@/features/restaurant/hour-dialog";
import { RestaurantWorkshopDialogProps } from "@/features/restaurant/workshop-dialog";
import { WorkshopWorkersDialogProps } from "@/features/restaurant/workshop-workers-dialog";
import { IRestaurant } from "@/types/restaurant.types";
import { IWorker } from "@/types/worker.types";
import { create } from "zustand";
import { IGuest } from "@/types/guest.types";
import { RestaurantPaymentMethodDialogProps } from "@/features/restaurant/payment-method-dialog";
import { RestaurantDishModifierDialogProps } from "@/features/restaurant/dish-modifier-dialog";
import { OrderDishModifiersDialogProps } from "@/features/order-dishes/order-dish-modifiers-dialog";
import { OrderDishReadyDialogProps } from "@/features/order-dishes/order-dish-ready-dialog";
import { DishesMenuDialogProps } from "@/features/dishes/dishes-menu-dialog";
import { DeleteDishesMenuDialogProps } from "@/features/dishes/dishes-menu-dialog/Delete";
import { DishCategoryDialogProps } from "@/features/dish-categories/dialog";
import { DishDialogProps } from "@/features/dishes/dialog";

export enum DialogType {
  Restaurant = "restaurant",
  RestaurantHour = "restaurantHour",
  RestaurantWorkshop = "restaurantWorkshop",
  RestaurantWorkshopWorkers = "restaurantWorkshopWorkers",
  RestaurantPaymentMethod = "restaurantPaymentMethod",
  Worker = "worker",
  Guest = "guest",
  DishCategory = "dishCategory",
  Dish = "dish",
  RestaurantDishModifier = "restaurantDishModifier",
  OrderDishModifiers = "orderDishModifiers",
  MarkOrderDishAsReady = "markOrderDishAsReady",
  DishesMenu = "dishesMenu",
  DishesMenuDelete = "dishesMenuDelete",
}

// Define data types for each dialog that needs data
export type DialogData = {
  [DialogType.Restaurant]?: IRestaurant;
  [DialogType.Worker]?: IWorker;
  [DialogType.RestaurantHour]?: RestaurantHourDialogProps["data"];
  [DialogType.RestaurantWorkshop]?: RestaurantWorkshopDialogProps["data"];
  [DialogType.RestaurantWorkshopWorkers]?: WorkshopWorkersDialogProps["data"];
  [DialogType.Guest]?: IGuest;
  [DialogType.DishCategory]?: DishCategoryDialogProps["data"];
  [DialogType.Dish]?: DishDialogProps["data"];
  [DialogType.RestaurantPaymentMethod]?: RestaurantPaymentMethodDialogProps["data"];
  [DialogType.RestaurantDishModifier]?: RestaurantDishModifierDialogProps["data"];
  [DialogType.OrderDishModifiers]?: OrderDishModifiersDialogProps["data"];
  [DialogType.MarkOrderDishAsReady]?: OrderDishReadyDialogProps["data"];
  [DialogType.DishesMenu]?: DishesMenuDialogProps["data"];
  [DialogType.DishesMenuDelete]?: DeleteDishesMenuDialogProps["data"];
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
