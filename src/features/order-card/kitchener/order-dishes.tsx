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

type Props = {
  order: IKitchenerOrder;
};

function KitchenerOrderDish(props: { dish: IKitchenerOrderDish }) {
  const { dish } = props;

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border border-dashed border-stone-400 px-1 py-1 transition-all",
        dish.status === "cooking" &&
          "cursor-pointer hover:border-solid hover:border-purple-500 hover:bg-purple-100 dark:hover:border-purple-400 dark:hover:bg-purple-900",
        dish.status === "ready" && "opacity-70"
      )}
      key={dish.id}
    >
      <div className="flex flex-row items-center justify-between">
        <p className="px-1 text-2xl font-bold text-stone-700 dark:text-stone-200">
          <span
            className={cn(
              "text-primary",
              dish.status === "cooking" && "text-purple-500"
            )}
          >{`x${dish.quantity} `}</span>
          {dish.name}
        </p>
        {dish.status === "cooking" && (
          <div
            className={cn(
              "mr-2 flex h-3 w-3 animate-pulse rounded-full bg-purple-500"
            )}
          />
        )}
      </div>
    </div>
  );
}

export default function KitchenerOrderDishes(props: Props) {
  const { order } = props;
  const { orderDishes } = order;

  const t = useTranslations();

  const shown = orderDishes.filter((dish) => dish.status === "cooking");
  const hidden = orderDishes.filter((dish) => dish.status !== "cooking");

  return (
    <div className="flex flex-col gap-1">
      {shown.map((dish) => (
        <KitchenerOrderDish key={dish.id} dish={dish} />
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
                  <KitchenerOrderDish key={dish.id} dish={dish} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
