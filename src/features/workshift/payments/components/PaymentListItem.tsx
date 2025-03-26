"use client";

import { cn } from "@/lib/utils";
import { DollarSignIcon, TrashIcon } from "lucide-react";
import { IWorkshiftPayment } from "@/types/workshift-payment.types";
import { EuroIcon } from "lucide-react";
import { RussianRubleIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import format from "@/utils/date-fns";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/features/guards/hooks/useSession";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDialogsStore, { DialogType } from "@/store/dialogs-store";

type Props = {
  payment: IWorkshiftPayment;
  index?: number;
};

const iconClassName = "min-w-4 min-h-4 h-4 w-4";

export default function PaymentListItem(props: Props) {
  const { payment, index } = props;
  const {
    category,
    amount,
    currency,
    type,
    note,
    worker,
    removedAt,
    removedByWorker,
    isRemoved,
    createdAt,
  } = payment;

  const t = useTranslations("workshift-payments");
  const session = useSession();
  const locale = useLocale();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const canRemove =
    isRemoved === false &&
    !removedAt &&
    (session.data?.role === "SYSTEM_ADMIN" ||
      session.data?.role === "CHIEF_ADMIN" ||
      (session.data?.role === "CASHIER" && worker.id === session.data.id));

  const handleRemoveClick = () => {
    toggleDialog(DialogType.WorkshiftPaymentRemove, true, {
      workshiftId: payment.workshiftId,
      payment,
    });
  };

  return (
    <>
      {index !== undefined && <Separator />}
      <div
        className={cn(
          "flex flex-row items-center gap-2",
          (isRemoved || removedAt) && "bg-red-200 dark:bg-red-950"
        )}
      >
        <div
          className={cn(
            "flex min-w-20 max-w-20 flex-row items-center text-lg font-bold",
            type === "INCOME" && "text-green-600",
            type === "EXPENSE" && "text-red-600",
            type === "CASHLESS" && "text-orange-600"
          )}
        >
          <p className="break-all">
            {amount}

            <span className="inline-flex">
              {currency === "RUB" && (
                <RussianRubleIcon className={cn(iconClassName)} />
              )}
              {currency === "EUR" && <EuroIcon className={cn(iconClassName)} />}
              {currency === "USD" && (
                <DollarSignIcon className={cn(iconClassName)} />
              )}
            </span>
          </p>
        </div>
        <div className="flex w-full flex-col">
          <p className="font-bold">
            {category.parent?.name ?? category.name}
            {category.parent && (
              <span className="font-medium">{` (${category.name})`}</span>
            )}
          </p>
          {note && <p className="text-stone-500">{note}</p>}
          <p className="text-sm uppercase tracking-wide text-stone-500">{`${
            worker.name
          }, ${format(new Date(createdAt), "dd.MM.yyyy HH:mm", locale)}`}</p>
          {removedAt && removedByWorker && (
            <p className="text-sm font-bold uppercase tracking-wide text-red-500">
              {t("removed-at", {
                date: format(new Date(removedAt), "dd.MM.yyyy HH:mm", locale),
                worker: removedByWorker.name,
              })}
            </p>
          )}
        </div>
        <div className="flex flex-row items-center gap-2">
          {canRemove && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRemoveClick}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("delete-payment")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </>
  );
}
