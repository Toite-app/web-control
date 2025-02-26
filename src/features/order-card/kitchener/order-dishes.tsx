"use client";

import { cn } from "@/lib/utils";
import { IKitchenerOrder, IKitchenerOrderDish } from "@/types/order.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { AlarmClockIcon, Settings2Icon } from "lucide-react";

type Props = {
  order: IKitchenerOrder;
};

function KitchenerOrderDish(props: {
  dish: IKitchenerOrderDish;
  order: IKitchenerOrder;
}) {
  const { dish } = props;

  const t = useTranslations();

  const canICookIt = dish.workshops.some((w) => w.isMyWorkshop === true);

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border border-dashed border-stone-400 px-1 py-1 transition-all",
        dish.status === "cooking" &&
          canICookIt &&
          "cursor-pointer hover:border-solid hover:border-purple-500 hover:bg-purple-100 dark:hover:border-purple-400 dark:hover:bg-purple-900",
        (dish.status === "ready" || !canICookIt) && "opacity-70"
      )}
      key={dish.id}
    >
      <div className="flex flex-row items-center gap-1">
        {dish.isAdditional && (
          <span className="text-xs text-primary">
            {t("KitchenerOrderCard.additional")}
          </span>
        )}
        {(!canICookIt || dish.status === "ready") && (
          <span className="text-xs text-muted-foreground">
            {dish.workshops.length === 0 && "-"}
            {dish.workshops
              .map((w) => {
                if (w.name.length > 10) {
                  return w.name.slice(0, 10) + "...";
                }

                return w.name;
              })
              .join(", ")}
          </span>
        )}
      </div>
      <div className="flex flex-row items-center justify-between">
        <p className="px-1 text-2xl font-bold text-stone-700 dark:text-stone-200">
          <span
            className={cn(
              "text-primary",
              dish.status === "cooking" && "text-purple-500"
            )}
          >{`x${dish.quantity} `}</span>
          {dish.name}
          {/* <span className="text-sm font-normal text-muted-foreground">{` (${formatTimeDistance(
            dish.cookingAt
              ? new Date(dish.cookingAt)
              : order.cookingAt
                ? new Date(order.cookingAt)
                : new Date(order.createdAt),
            locale,
            {
              addSuffix: false,
              now: dish.readyAt ? new Date(dish.readyAt) : now,
            }
          )})`}</span> */}
        </p>

        <div className="mr-2 flex flex-row items-center gap-2">
          {dish.status === "cooking" && (
            <>
              {dish.isReadyOnTime === false && (
                <AlarmClockIcon className="h-4 min-h-4 w-4 min-w-4 animate-ping text-red-500 dark:text-red-400" />
              )}
              <div
                className={cn(
                  "flex h-3 min-h-3 w-3 min-w-3 animate-pulse rounded-full bg-purple-500"
                )}
              />
            </>
          )}
          {dish.status === "ready" && (
            <>
              {dish.isReadyOnTime === false && (
                <AlarmClockIcon className="h-4 min-h-4 w-4 min-w-4 text-red-500" />
              )}
              {dish.isReadyOnTime === true && (
                <AlarmClockIcon className="h-4 min-h-4 w-4 min-w-4 text-green-500" />
              )}
            </>
          )}
        </div>
      </div>
      {dish.modifiers.length > 0 && (
        <div className="flex flex-row items-center gap-1">
          <Settings2Icon className="h-4 w-4 text-red-500" />
          <span className="text-base font-semibold text-red-500">
            {dish.modifiers.map((m) => m.name).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}

export default function KitchenerOrderDishes(props: Props) {
  const { order } = props;
  const { orderDishes } = order;

  const t = useTranslations();

  const shown = orderDishes.filter(
    (dish) =>
      dish.status === "cooking" && dish.workshops.some((w) => w.isMyWorkshop)
  );

  const hidden = orderDishes.filter(
    (dish) =>
      dish.status !== "cooking" || dish.workshops.every((w) => !w.isMyWorkshop)
  );

  return (
    <div className="flex flex-col gap-1">
      {shown.map((dish) => (
        <KitchenerOrderDish key={dish.id} dish={dish} order={order} />
      ))}
      {hidden.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="py-2">
              <span className="text-sm">
                {t("KitchenerOrderCard.show-full-list")}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1">
                {hidden.map((dish) => (
                  <KitchenerOrderDish key={dish.id} dish={dish} order={order} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
