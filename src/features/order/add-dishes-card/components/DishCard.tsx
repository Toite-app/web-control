"use client";

import { createOrderDishMutation } from "@/api/fetch/orders/dishes/createOrderDish";
import { updateOrderDishMutation } from "@/api/fetch/orders/dishes/updateOrderDish";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import useDebouncedValue from "@/hooks/use-debounced-value";
import DishLib from "@/lib/dish";
import ImageLib from "@/lib/image";
import { cn } from "@/lib/utils";
import { IDish } from "@/types/dish.types";
import { IOrder } from "@/types/order.types";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  dish: IDish;
  order?: IOrder | null;
};

type FormValues = {
  quantity: number;
};

export default function OrderDishCard({ dish, order }: Props) {
  const t = useTranslations();
  const handleError = useErrorHandler();

  const alreadyAdded = useMemo(() => {
    return (order?.orderDishes ?? []).find(
      (od) => od.dishId === dish.id && od.status === "pending" && !od.isRemoved
    );
  }, [order, dish.id]);

  const { register, watch, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      quantity: alreadyAdded?.quantity ?? 0,
    },
  });

  const quantity = watch("quantity");
  const debouncedQuantity = useDebouncedValue(quantity, 1000);

  const updateQuantity = useCallback(
    async (newQuantity: number) => {
      if (!order || newQuantity === alreadyAdded?.quantity) return;

      try {
        if (alreadyAdded) {
          // Update existing order dish
          await updateOrderDishMutation({
            urlValues: {
              orderId: order.id,
              orderDishId: alreadyAdded.id,
            },
            data: {
              dishId: dish.id,
              quantity: newQuantity,
            },
          });
        } else {
          // Create new order dish
          await createOrderDishMutation({
            urlValues: { orderId: order.id },
            data: {
              dishId: dish.id,
              quantity: newQuantity,
            },
          });
        }
      } catch (error) {
        handleError({
          error,
        });
        // Revert to previous value on error
        setValue("quantity", alreadyAdded?.quantity ?? 0);
      }
    },
    [order, alreadyAdded, dish.id, setValue, handleError]
  );

  // Watch for debounced quantity changes and update the server
  useEffect(() => {
    if (debouncedQuantity > 0) {
      updateQuantity(debouncedQuantity);
    }
  }, [debouncedQuantity, updateQuantity]);

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

  const handleAdd = () => {
    setValue("quantity", 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setValue("quantity", newQuantity);
    }
  };

  // Update quantity if alreadyAdded changes
  useEffect(() => {
    if (alreadyAdded) {
      setValue("quantity", alreadyAdded.quantity);
    }
  }, [alreadyAdded, setValue]);

  // Ensure quantity is never less than 0
  useEffect(() => {
    if (quantity < 0) {
      setValue("quantity", 0);
    }
  }, [quantity, setValue]);

  return (
    <div
      className={cn(
        "relative flex w-full flex-row rounded-xl border border-stone-200 p-2",
        quantity > 0 && "bg-primary/30"
      )}
    >
      <div className="absolute left-0 top-0 z-10 drop-shadow-lg">
        <img
          src={ImageLib.getImageUrl(DishLib.getDishMainImage(dish))}
          className="h-16 w-16 rounded-full"
          alt={dish.name}
          width={96}
          height={96}
        />
      </div>
      <div className="ml-16 flex w-full flex-col gap-1">
        <span className="font-bold">{dish.name}</span>
        {quantity === 0 ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAdd}
            type="button"
            size="extra-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="ml-2">{t("Orders.add-dishes.add-button")}</span>
          </Button>
        ) : (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {t("Orders.add-dishes.quantity")}
            </span>
            <div className="flex flex-row items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleDecrement}
                type="button"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                {...register("quantity", {
                  valueAsNumber: true,
                  min: 0,
                })}
                type="number"
                className="w-full text-center"
                onClick={handleInputClick}
                onChange={handleInputChange}
                placeholder={t("Orders.add-dishes.quantity-placeholder")}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleIncrement}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
