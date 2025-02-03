import { createOrderDishMutation } from "@/api/fetch/orders/dishes/createOrderDish";
import { updateOrderDishMutation } from "@/api/fetch/orders/dishes/updateOrderDish";
import useDebouncedValue from "@/hooks/use-debounced-value";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { IOrderDish } from "@/types/order.types";
import { useCallback, useEffect, useState } from "react";

import { create } from "zustand";

const updatingDishesStore = create<{
  updatingMap: Record<string, boolean>;
  addToUpdatingMap: (dishId: string) => void;
  removeFromUpdatingMap: (dishId: string) => void;
}>((set) => ({
  updatingMap: {},
  addToUpdatingMap: (dishId) =>
    set((state) => ({
      updatingMap: {
        ...state.updatingMap,
        [dishId]: true,
      },
    })),
  removeFromUpdatingMap: (dishId) =>
    set((state) => ({
      updatingMap: Object.fromEntries(
        Object.entries(state.updatingMap).filter(([key]) => key !== dishId)
      ),
    })),
}));

type Options = {
  orderId?: string | null;
  dishId: string;
  orderDish?: Pick<IOrderDish, "id" | "quantity">;
  quantity?: number;
  saveDebounceTime?: number;
};

export default function useDishQuantity(options: Options) {
  const {
    orderId,
    dishId,
    orderDish,
    quantity,
    saveDebounceTime = 1000,
  } = options;

  const handleError = useErrorHandler();

  const [localQuantity, setLocalQuantity] = useState(quantity ?? 0);

  // Debounce the quantity to save to the server
  const debouncedQuantity = useDebouncedValue(localQuantity, saveDebounceTime);

  /**
   * Increment the quantity of the dish
   */
  const increment = useCallback(() => {
    setLocalQuantity((prev) => prev + 1);
  }, []);

  /**
   * Decrement the quantity of the dish
   */
  const decrement = useCallback(
    () =>
      setLocalQuantity((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      }),
    []
  );

  /**
   * Set the local quantity from the parent component
   */
  const onChange = useCallback((value: number) => {
    if (value === undefined || value === null || Number.isNaN(value)) return;
    if (value < 0) value = 0;

    setLocalQuantity(value);
  }, []);

  const save = useCallback(async () => {
    const isAlreadyUpdating =
      !!updatingDishesStore.getState().updatingMap?.[dishId];

    if (isAlreadyUpdating) return;

    if (!orderId) return;
    if (!orderDish && debouncedQuantity === 0) return;

    if (orderDish && orderDish.quantity === debouncedQuantity) {
      console.log("debouncedQuantity === orderDish.quantity");
      return;
    }

    try {
      updatingDishesStore.getState().addToUpdatingMap(dishId);

      if (orderDish) {
        // Handle just change of quantity
        if (debouncedQuantity > 0) {
          await updateOrderDishMutation({
            urlValues: {
              orderId,
              orderDishId: orderDish.id,
            },
            data: {
              quantity: debouncedQuantity,
            },
          });
        }
      } else {
        // Handle adding a new dish if it doesn't exist yet
        await createOrderDishMutation({
          urlValues: {
            orderId,
          },
          data: {
            dishId,
            quantity: debouncedQuantity,
          },
        });
      }
    } catch (error) {
      handleError({
        error,
      });
    } finally {
      // Prevent from spamming with one second timeout
      setTimeout(() => {
        updatingDishesStore.getState().removeFromUpdatingMap(dishId);
      }, 1000);
    }
  }, [debouncedQuantity, orderId, dishId, orderDish, handleError]);

  // If there is a quantity prop, set the local quantity from it
  // It need's for cases when the quantity is handling in parent component
  useEffect(() => {
    if (quantity === undefined || quantity === null || Number.isNaN(quantity)) {
      return;
    }

    setLocalQuantity(quantity < 0 ? 0 : quantity);
  }, [quantity]);

  useEffect(() => {
    if (!orderDish) return;

    setLocalQuantity(orderDish.quantity);
  }, [orderDish]);

  useEffect(() => {
    save();
  }, [debouncedQuantity, save]);

  return {
    value: localQuantity,
    onChange,
    increment,
    decrement,
  };
}
