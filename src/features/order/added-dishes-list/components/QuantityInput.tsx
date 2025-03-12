"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IOrderDish } from "@/types/order.types";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import useDishQuantity from "@/features/order/hooks/use-dish-quantity";

type Props = {
  orderDish: IOrderDish;
};

export default function OrderDishQuantityInput({ orderDish }: Props) {
  const t = useTranslations();

  const { decrement, increment, value, onChange } = useDishQuantity({
    dishId: orderDish.dishId,
    orderId: orderDish.orderId,
    orderDish,
  });

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onChange(newQuantity);
    }
  };

  if (orderDish.status !== "pending") {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <p>{orderDish.quantity}</p>
        {orderDish.quantityReturned > 0 && (
          <p className="text-xs text-red-500">
            {t("AddedDishesList.returnment")}: {orderDish.quantityReturned}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={decrement}
        type="button"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        value={value ?? ""}
        type="number"
        className="h-8 w-14 text-center text-sm"
        onClick={handleInputClick}
        onChange={handleInputChange}
        placeholder={t("Orders.add-dishes.quantity-placeholder")}
      />
      <Button
        variant="outline"
        size="icon-sm"
        onClick={increment}
        type="button"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
