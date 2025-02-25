"use client";

import { IKitchenerOrder } from "@/types/order.types";
import OrderCardHeader from "@/features/order-card/shared/header";

import OrderCardStatusText from "@/features/order-card/shared/status-text";
import OrderCardTime from "@/features/order-card/shared/time";
import { cn } from "@/lib/utils";
import KitchenerOrderDishes from "@/features/order-card/kitchener/order-dishes";

type KitchenerOrderCardProps = {
  className?: string;
  order: IKitchenerOrder;
};

export default function KitchenerOrderCard(props: KitchenerOrderCardProps) {
  const { order, className } = props;
  const { note } = order;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-clip rounded-lg bg-white shadow-md dark:bg-stone-800",
        className
      )}
    >
      <OrderCardHeader order={order} renderGuestsAmount />
      <div className="flex flex-col px-3 py-3">
        {note && (
          <div className="flex py-1 text-base">
            <p className="text-indigo-500 dark:text-indigo-300">{note}</p>
          </div>
        )}
        <KitchenerOrderDishes order={order} />
        <OrderCardStatusText order={order} />
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-col">
            <OrderCardTime order={order} />
          </div>
          {/* <OrderCardPrice order={order} /> */}
        </div>
      </div>
    </div>
  );
}
