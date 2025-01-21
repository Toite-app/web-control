"use client";

import { format } from "date-fns";
import { IOrder } from "@/types/order.types";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { CookingPot } from "@phosphor-icons/react/dist/ssr/CookingPot";
import { ChefHat } from "@phosphor-icons/react/dist/ssr/ChefHat";
import { Buildings } from "@phosphor-icons/react/dist/ssr/Buildings";
import { useTranslations } from "next-intl";

type Props = {
  order: IOrder;
};

export default function OrderCardStatusesSubheader(props: Props) {
  const { order } = props;
  const { restaurantId, delayedTo } = order;

  const t = useTranslations();

  return (
    <>
      {/* <div className="flex flex-row items-center gap-2 bg-lime-600 px-2 py-1">
        <ChefHat className="h-4 w-4 text-white" weight="fill" />
        <span className="text-sm text-white">
          {t("OrderCard.statuses.dishes-ready")}
        </span>
      </div> */}
      {restaurantId === null && (
        <div className="flex flex-row items-center gap-2 bg-red-600 px-2 py-1">
          <Buildings className="h-4 w-4 text-white" weight="fill" />
          <span className="text-sm text-white">
            {t("OrderCard.statuses.attach-restaurant")}
          </span>
        </div>
      )}
      {/* <div className="flex flex-row items-center gap-2 bg-red-600 px-2 py-1">
        <CookingPot className="h-4 w-4 text-white" weight="fill" />
        <span className="text-sm text-white">{t("OrderCard.statuses.send-to-kitchen")}</span>
      </div> */}

      {!!delayedTo && (
        <div className="flex flex-row items-center gap-2 bg-indigo-600 px-2 py-1">
          <Clock className="h-4 w-4 text-white" weight="fill" />
          <span className="text-sm text-white">
            {`${t("OrderCard.statuses.delayed-to")} ${format(
              new Date(delayedTo),
              "dd.MM.yy"
            )}`}
          </span>
        </div>
      )}
    </>
  );
}
