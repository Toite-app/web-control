"use client";
import formatOrderNumber from "@/utils/format-order-number";
import { IDispatcherOrder, IOrder } from "@/types/order.types";
import { cn } from "@/lib/utils";
import { DeviceMobile } from "@phosphor-icons/react/dist/ssr/DeviceMobile";
import { Desktop } from "@phosphor-icons/react/dist/ssr/Desktop";
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck";
import { Backpack } from "@phosphor-icons/react/dist/ssr/Backpack";
import { Cheers } from "@phosphor-icons/react/dist/ssr/Cheers";
import { CheckIcon, ClockIcon, PenIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  order: IDispatcherOrder;
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
  const { order } = props;
  const { number, status, type, from, orderDishes } = order;
  const t = useTranslations("OrderCard");

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
        orderStatusColors[status]
      )}
    >
      <span className="text-lg font-bold text-white dark:text-stone-100">
        {formatOrderNumber(number)}
      </span>
      <div className="flex flex-row items-center gap-4">
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
                <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                  <path d="M22 7.5C22 5.57 17.52 4 12 4S2 5.57 2 7.5c0 1.81 3.95 3.31 9 3.48V15H9.35c-.82 0-1.55.5-1.86 1.26L6 20h2l1.2-3h5.6l1.2 3h2l-1.5-3.74c-.3-.76-1.04-1.26-1.85-1.26H13v-4.02c5.05-.17 9-1.67 9-3.48z"></path>
                </svg>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("type.hall")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {type === "delivery" && (
            <Tooltip>
              <TooltipTrigger>
                <Truck className="h-5 w-5 text-white" weight="fill" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("type.delivery")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {type === "takeaway" && (
            <Tooltip>
              <TooltipTrigger>
                <Backpack className="h-5 w-5 text-white" weight="fill" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("type.takeaway")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {type === "banquet" && (
            <Tooltip>
              <TooltipTrigger>
                <Cheers className="h-5 w-5 text-white" weight="fill" />
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
