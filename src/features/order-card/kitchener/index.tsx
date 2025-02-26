"use client";

import { IKitchenerOrder } from "@/types/order.types";
import OrderCardHeader from "@/features/order-card/shared/header";
import { cn } from "@/lib/utils";
import KitchenerOrderDishes from "@/features/order-card/kitchener/order-dishes";
import { format } from "date-fns";
import { useLocale, useNow } from "next-intl";
import formatTimeDistance from "@/utils/format-time-distance";

type KitchenerOrderCardProps = {
  className?: string;
  order: IKitchenerOrder;
};

export default function KitchenerOrderCard(props: KitchenerOrderCardProps) {
  const { order, className } = props;
  const { note } = order;

  const locale = useLocale();
  const now = useNow({
    updateInterval: 60_000,
  });

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-clip rounded-lg bg-white shadow-md dark:bg-stone-800",
        className
      )}
    >
      <OrderCardHeader order={order} renderGuestsAmount />
      <div className="flex flex-col px-3 pb-3 pt-1">
        {note && (
          <div className="flex py-1 text-base">
            <p className="text-indigo-500 dark:text-indigo-300">{note}</p>
          </div>
        )}
        <KitchenerOrderDishes order={order} />
        <div className="mt-2 flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row gap-1">
            <p className="text-lg font-bold">
              {format(
                order.cookingAt ? new Date(order.cookingAt) : order.createdAt,
                "dd.MM.yy HH:mm"
              )}
              <span className="ml-1 text-sm font-thin text-muted-foreground">
                {`(${formatTimeDistance(
                  order.cookingAt ? new Date(order.cookingAt) : order.createdAt,
                  locale,
                  {
                    addSuffix: false,
                    now,
                  }
                )})`}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
