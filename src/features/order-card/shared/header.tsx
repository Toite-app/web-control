"use client";
import formatOrderNumber from "@/utils/format-order-number";
import { IOrder, IOrderDish } from "@/types/order.types";
import { cn } from "@/lib/utils";
import { DeviceMobile } from "@phosphor-icons/react/dist/ssr/DeviceMobile";
import { Desktop } from "@phosphor-icons/react/dist/ssr/Desktop";

import { CheckIcon, ClockIcon, PenIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OrderTypeIcon from "@/features/order-card/shared/type-icon";
import { Person } from "@phosphor-icons/react/dist/ssr/Person";

type Props = {
  order: Partial<
    Pick<IOrder, "id" | "number" | "status" | "type" | "from"> & {
      orderDishes: Partial<Pick<IOrderDish, "status" | "isRemoved">>[];
    }
  >;
  renderGuestsAmount?: boolean;
};

export const orderStatusColors: Record<IOrder["status"], string> = {
  pending: "bg-indigo-500 dark:bg-indigo-800",
  cooking: "bg-orange-500 dark:bg-orange-800",
  ready: "bg-green-500 dark:bg-green-800",
  delivering: "bg-blue-500 dark:bg-blue-800",
  paid: "bg-purple-500 dark:bg-purple-800",
  completed: "bg-gray-500 dark:bg-gray-800",
  cancelled: "bg-gray-500 dark:bg-gray-800",
};

export default function OrderCardHeader(props: Props) {
  const { order, renderGuestsAmount = false } = props;
  const { number, status, type, from, guestsAmount } = order;
  const t = useTranslations("OrderCard");

  const orderDishes = order.orderDishes ?? [];

  const notStartedCnt = orderDishes.filter(
    (dish) => dish.status === "pending"
  ).length;

  const inProcessCnt = orderDishes.filter(
    (dish) => dish.status === "cooking"
  ).length;

  const readyCnt = orderDishes.filter(
    (dish) => dish.status === "ready" || dish.status === "completed"
  ).length;

  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between bg-stone-400 px-2 py-1",
        orderStatusColors[status ?? "pending"]
      )}
    >
      {number && (
        <span className="text-lg font-bold text-white dark:text-stone-100">
          {formatOrderNumber(number)}
        </span>
      )}
      <div className="flex flex-row items-center gap-4">
        {renderGuestsAmount && guestsAmount && (
          <div className="flex max-h-[22px] flex-row items-center gap-2 rounded-xl bg-white px-3">
            <div className="flex flex-row items-center gap-1 text-stone-500">
              <span>{guestsAmount}</span>
              <Person className="h-4 w-4" weight="fill" />
            </div>
          </div>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex max-h-[22px] flex-row items-center gap-2 rounded-xl bg-white px-3">
                <span className="flex flex-row items-center gap-1 text-sm text-stone-700">
                  <CheckIcon className="h-4 w-4 text-stone-700" />
                  {readyCnt}
                </span>
                <span className="flex flex-row items-center gap-1 text-sm text-stone-700">
                  <ClockIcon className="h-4 w-4 text-stone-700" />
                  {inProcessCnt}
                </span>
                <span className="flex flex-row items-center gap-1 text-sm text-stone-700">
                  <PenIcon className="h-4 w-4 text-stone-700" />
                  {notStartedCnt}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("dishes-status")}</p>
            </TooltipContent>
          </Tooltip>
          {from === "app" && (
            <Tooltip>
              <TooltipTrigger>
                <DeviceMobile className="h-5 w-5 text-white" weight="fill" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("from.app")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {from === "website" && (
            <Tooltip>
              <TooltipTrigger>
                <Desktop className="h-5 w-5 text-white" weight="fill" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("from.website")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {type === "hall" && (
            <Tooltip>
              <TooltipTrigger>
                <OrderTypeIcon type={type} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("type.hall")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {type === "delivery" && (
            <Tooltip>
              <TooltipTrigger>
                <OrderTypeIcon type={type} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("type.delivery")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {type === "takeaway" && (
            <Tooltip>
              <TooltipTrigger>
                <OrderTypeIcon type={type} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("type.takeaway")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {type === "banquet" && (
            <Tooltip>
              <TooltipTrigger>
                <OrderTypeIcon type={type} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("type.banquet")}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}
