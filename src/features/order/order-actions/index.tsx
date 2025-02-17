"use client";

import { Button } from "@/components/ui/button";
import { IOrder } from "@/types/order.types";
import { CookingPot } from "@phosphor-icons/react/dist/ssr/CookingPot";
import { Receipt } from "@phosphor-icons/react/dist/ssr/Receipt";
import { MathOperations } from "@phosphor-icons/react/dist/ssr/MathOperations";
import { useTranslations } from "next-intl";
import { useGetOrderAvailableActions } from "@/api/fetch/orders/available-actions/useGetOrderAvailableActions";

type Props = {
  order?: IOrder | null;
};

export default function OrderActions({ order }: Props) {
  const t = useTranslations();

  const actions = useGetOrderAvailableActions({
    urlValues: {
      orderId: String(order?.id),
    },
    config: { keepPreviousData: true },
    skip: !order?.id,
  });

  const canPrecheck = actions.isLoading ? false : !!actions.data?.canPrecheck;
  const canSendToKitchen = actions.isLoading
    ? false
    : !!actions.data?.canSendToKitchen;
  const canCalculate = actions.isLoading ? false : !!actions.data?.canCalculate;

  return (
    <div className="flex w-full flex-col gap-2">
      <Button variant="default" disabled={!canPrecheck}>
        <div className="flex flex-row items-center gap-3">
          <Receipt className="h-5 w-5" weight="fill" />
          <p className="tracking-wide">
            {t("Order.action-variants.print-pre-check")}
          </p>
        </div>
      </Button>
      <Button
        className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800"
        variant="default"
        disabled={!canSendToKitchen}
      >
        <div className="flex flex-row items-center gap-3">
          <CookingPot
            className="h-5 w-5 text-cyan-100 dark:text-cyan-900"
            weight="fill"
          />
          <p className="tracking-wide text-cyan-50 dark:text-cyan-900">
            {t("Order.action-variants.send-to-kitchen")}
          </p>
        </div>
      </Button>
      <Button
        className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800"
        variant="default"
        disabled={!canCalculate}
      >
        <div className="flex flex-row items-center gap-3">
          <MathOperations
            className="h-5 w-5 text-rose-100 dark:text-rose-900"
            weight="fill"
          />
          <p className="tracking-wide text-rose-50 dark:text-rose-900">
            {t("Order.action-variants.calculate-order")}
          </p>
        </div>
      </Button>
    </div>
  );
}
