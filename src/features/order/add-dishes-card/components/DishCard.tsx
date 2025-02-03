"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DishLib from "@/lib/dish";
import ImageLib from "@/lib/image";
import { cn } from "@/lib/utils";
import { IDish } from "@/types/dish.types";
import { IOrder } from "@/types/order.types";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import useDishQuantity from "@/features/order/hooks/use-dish-quantity";

type Props = {
  dish: IDish;
  order?: IOrder | null;
};

export default function OrderDishCard({ dish, order }: Props) {
  const t = useTranslations();

  const alreadyAdded = useMemo(() => {
    return (order?.orderDishes ?? []).find(
      (od) => od.dishId === dish.id && od.status === "pending" && !od.isRemoved
    );
  }, [order, dish.id]);

  const { decrement, increment, value, onChange } = useDishQuantity({
    dishId: dish.id,
    orderId: order?.id,
    orderDish: alreadyAdded,
  });

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  const handleAdd = () => {
    onChange(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onChange(newQuantity);
    }
  };

  return (
    <div
      className={cn(
        "relative flex w-full flex-row rounded-xl border border-stone-200 p-2",
        value > 0 && "bg-primary/30"
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
        {value === 0 ? (
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
                onClick={decrement}
                type="button"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                value={value}
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
                onClick={increment}
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
