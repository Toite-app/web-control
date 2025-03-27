"use client";

import { Button } from "@/components/ui/button";
import OrderPrecheckPrint from "@/features/order/order-actions/components/OrderPrecheckPrint";
import { IOrderHistory } from "@/types/order-history.types";
import { Receipt } from "@phosphor-icons/react/dist/ssr/Receipt";
import format from "@/utils/date-fns";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CurrencyIcon from "@/components/currency-icon";
import formatPrice from "@/utils/format-price";

type Props = {
  history: IOrderHistory;
};

export default function HistoryItem({ history }: Props) {
  const { precheck, worker, type, createdAt } = history;

  const t = useTranslations();
  const locale = useLocale();
  const precheckRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: precheckRef,
  });

  return (
    <div className="relative flex items-start gap-4 pl-6">
      {/* Timeline dot and line */}
      <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-border" />
      <div className="absolute left-[-4px] top-2 h-[10px] w-[10px] rounded-full bg-primary" />

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <p>{t(`order-history.type.${type}`)}</p>
            {worker && (
              <p className="text-sm text-muted-foreground">
                {`${worker.name} (${t(`roles.${worker.role}`)})`}
              </p>
            )}
            {!worker && (
              <p className="text-sm text-muted-foreground">
                {t("order-history.system")}
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {format(createdAt, "HH:mm", locale)}
          </p>
        </div>
        {type === "precheck" && precheck && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => handlePrint()}
            >
              <Receipt className="h-5 w-5" />
              <span className="ml-2">{`${t(
                "order-history.see-precheck"
              )}`}</span>
              <span className="ml-2 flex flex-row flex-nowrap items-center whitespace-nowrap text-nowrap">
                {"("}
                {formatPrice(
                  precheck.positions.reduce(
                    (acc, position) =>
                      acc +
                      Number(position.finalPrice) * Number(position.quantity),
                    0
                  ),
                  {
                    alwaysShowDecimals: true,
                    groupNumbers: true,
                  }
                )}
                <CurrencyIcon
                  className="inline-flex h-4 w-4"
                  currency={precheck.currency}
                />
                {")"}
              </span>
            </Button>
            <div style={{ display: "none" }}>
              <OrderPrecheckPrint ref={precheckRef} precheck={precheck} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
