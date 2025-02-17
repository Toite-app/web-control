"use client";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { IOrder, IOrderDish } from "@/types/order.types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  RussianRubleIcon,
  EuroIcon,
  DollarSignIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";
import OrderDishQuantityInput from "./QuantityInput";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDishQuantity from "@/features/order/hooks/use-dish-quantity";
import { useCallback } from "react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { forceReadyOrderDishMutation } from "@/api/fetch/orders/dishes/forceReady";
import { useToast } from "@/hooks/use-toast";

type Props = {
  orderDish: IOrderDish;
  order: IOrder;
};

export default function AddedOrderDishRow({ orderDish, order }: Props) {
  const { currency } = order;
  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const { remove } = useDishQuantity({
    dishId: orderDish.dishId,
    orderDish,
    orderId: order.id,
    saveDebounceTime: 50,
  });

  const handleForceReady = useCallback(async () => {
    try {
      await forceReadyOrderDishMutation({
        urlValues: {
          orderId: order.id,
          orderDishId: orderDish.id,
        },
      });

      toast({
        title: t("AddedOrderDishRow.force-ready-success"),
        description: t("AddedOrderDishRow.force-ready-success-description"),
        variant: "success",
      });
    } catch (error) {
      handleError({ error });
    }
  }, [order, orderDish, handleError, t, toast]);

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          {orderDish.isAdditional && (
            <span className="text-sm text-primary">
              {t("AddedDishesList.additional-cooking")}
            </span>
          )}
          {orderDish.name}
        </div>
      </TableCell>
      <TableCell>
        <div
          className={cn(
            "rounded-lg px-2 py-1 text-center text-white",
            orderDish.status === "cooking" && "bg-amber-500",
            orderDish.status === "ready" && "bg-green-500",
            orderDish.status === "completed" && "bg-emerald-500",
            orderDish.status === "pending" && "bg-stone-700"
          )}
        >
          {t(`AddedDishesList.statuses.${orderDish.status}`)}
        </div>
      </TableCell>
      <TableCell>
        <OrderDishQuantityInput orderDish={orderDish} />
      </TableCell>
      <TableCell>
        <div className="flex flex-row items-center gap-1">
          {Number(orderDish.finalPrice) * orderDish.quantity}
          {currency === "RUB" && <RussianRubleIcon className="h-4 w-4" />}
          {currency === "EUR" && <EuroIcon className="h-4 w-4" />}
          {currency === "USD" && <DollarSignIcon className="h-4 w-4" />}
        </div>
      </TableCell>
      <TableCell>
        {orderDish.status === "pending" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={remove}>
                  <XIcon className="h-4 w-4 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("AddedDishesList.removeDish")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {orderDish.status === "cooking" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleForceReady}
                >
                  <CheckIcon className="h-4 w-4 text-green-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("AddedDishesList.forceCooking")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </TableCell>
    </TableRow>
  );
}
