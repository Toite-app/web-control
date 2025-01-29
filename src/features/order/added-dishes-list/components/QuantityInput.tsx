"use client";

import { updateOrderDishMutation } from "@/api/fetch/orders/dishes/updateOrderDish";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import useDebouncedValue from "@/hooks/use-debounced-value";
import { IOrderDish } from "@/types/order.types";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

type Props = {
  orderDish: IOrderDish;
};

type FormValues = {
  quantity: number;
};

export default function OrderDishQuantityInput({ orderDish }: Props) {
  const t = useTranslations();
  const handleError = useErrorHandler();
  const isInternalUpdate = useRef(false);

  const { register, watch, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      quantity: orderDish.quantity,
    },
  });

  const quantity = watch("quantity");
  const debouncedQuantity = useDebouncedValue(quantity, 1000);

  const updateQuantity = useCallback(
    async (newQuantity: number) => {
      if (newQuantity === orderDish.quantity) return;

      try {
        await updateOrderDishMutation({
          urlValues: {
            orderId: orderDish.orderId,
            orderDishId: orderDish.id,
          },
          data: {
            dishId: orderDish.dishId,
            quantity: newQuantity,
          },
        });
      } catch (error) {
        handleError({
          error,
        });
        // Revert to previous value on error
        isInternalUpdate.current = true;
        setValue("quantity", orderDish.quantity);
      }
    },
    [orderDish, setValue, handleError]
  );

  // Watch for debounced quantity changes and update the server
  useEffect(() => {
    if (debouncedQuantity > 0 && !isInternalUpdate.current) {
      updateQuantity(debouncedQuantity);
    }
    isInternalUpdate.current = false;
  }, [debouncedQuantity, updateQuantity]);

  // Update form value only if orderDish quantity actually changed
  useEffect(() => {
    if (orderDish.quantity !== getValues("quantity")) {
      isInternalUpdate.current = true;
      setValue("quantity", orderDish.quantity);
    }
  }, [orderDish.quantity, setValue, getValues]);

  const handleIncrement = () => {
    setValue("quantity", getValues("quantity") + 1);
  };

  const handleDecrement = () => {
    const currentValue = getValues("quantity");
    if (currentValue > 0) {
      setValue("quantity", currentValue - 1);
    }
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setValue("quantity", newQuantity);
    }
  };

  // Ensure quantity is never less than 0
  useEffect(() => {
    if (quantity < 0) {
      isInternalUpdate.current = true;
      setValue("quantity", 0);
    }
  }, [quantity, setValue]);

  return (
    <div className="flex flex-row items-center gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleDecrement}
        type="button"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        {...register("quantity", {
          valueAsNumber: true,
          min: 0,
        })}
        type="number"
        className="h-8 w-14 text-center text-sm"
        onClick={handleInputClick}
        onChange={handleInputChange}
        placeholder={t("Orders.add-dishes.quantity-placeholder")}
      />
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleIncrement}
        type="button"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
