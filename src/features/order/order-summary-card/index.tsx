"use client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderTypeIcon from "@/features/order-card/shared/type-icon";
import { IOrder } from "@/types/order.types";
import { DeviceMobile } from "@phosphor-icons/react/dist/ssr/DeviceMobile";
import { Desktop } from "@phosphor-icons/react/dist/ssr/Desktop";
import { useTranslations } from "next-intl";

import { OrderUtils } from "@/utils/order";
import { cn } from "@/lib/utils";
import formatPrice from "@/utils/format-price";
import CurrencyIcon from "@/components/currency-icon";
type Props = {
  order?: IOrder | null;
};

const PriceElement = ({
  className,
  iconClassName,
  value,
  currency,
}: {
  className?: string;
  iconClassName?: string;
  value: number | string;
  currency: string;
}) => {
  return (
    <div className={cn("flex flex-row items-center gap-1", className)}>
      <p>
        {formatPrice(value, { alwaysShowDecimals: true, groupNumbers: true })}
      </p>
      <CurrencyIcon
        className={cn("h-4 w-4", iconClassName)}
        currency={currency}
      />
    </div>
  );
};

export default function OrderSummaryCard({ order }: Props) {
  const t = useTranslations();

  if (!order) return null;

  const {
    type,
    from,
    restaurantName,
    discountAmount,
    subtotal,
    total,
    bonusUsed,
    surchargeAmount,
    currency,
  } = order;

  const pricePercents = OrderUtils.calculateOrderPercents(order);

  return (
    <Card className="flex w-full flex-col gap-2 p-4">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">
          {t("Order.summary-card.order-from")}
        </h3>
        <div className="flex flex-row items-center gap-1">
          {from === "website" && (
            <Desktop
              className="h-5 w-5 text-stone-800 dark:text-stone-200"
              weight="fill"
            />
          )}
          {from === "app" && (
            <DeviceMobile
              className="h-5 w-5 text-stone-800 dark:text-stone-200"
              weight="fill"
            />
          )}
          <p>{t(`Order.summary-card.order-from-values.${from}`)}</p>
        </div>
      </div>
      <Separator />
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">
          {t("Order.summary-card.order-type")}
        </h3>
        <div className="flex flex-row items-center gap-1">
          <OrderTypeIcon
            className="fill-stone-800 dark:fill-stone-200"
            type={type}
          />
          <p>{t(`Order.summary-card.order-type-values.${type}`)}</p>
        </div>
      </div>
      <Separator />
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">
          {t("Order.summary-card.order-restaurant")}
        </h3>
        <p>{restaurantName ?? "-"}</p>
      </div>
      <Separator />
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">
          {t("Order.summary-card.prices.subtotal")}
        </h3>
        <PriceElement value={subtotal} currency={currency} />
      </div>
      {Number(discountAmount) > 0 && (
        <>
          <Separator />
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium text-muted-foreground">
              {t("Order.summary-card.prices.discountAmount")}
              <span className="ml-2 text-sm text-primary">
                ({pricePercents.discountPercent.toFixed(1)}%)
              </span>
            </h3>
            <PriceElement value={discountAmount} currency={currency} />
          </div>
        </>
      )}
      {Number(surchargeAmount) > 0 && (
        <>
          <Separator />
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium text-muted-foreground">
              {t("Order.summary-card.prices.surchargeAmount")}
              <span className="ml-2 text-sm text-destructive">
                ({pricePercents.surchargePercent.toFixed(1)}%)
              </span>
            </h3>
            <PriceElement value={surchargeAmount} currency={currency} />
          </div>
        </>
      )}
      {Number(bonusUsed) > 0 && (
        <>
          <Separator />
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium text-muted-foreground">
              {t("Order.summary-card.prices.bonusUsed")}
            </h3>
            <PriceElement value={bonusUsed} currency={currency} />
          </div>
        </>
      )}
      <Separator />
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">
          {t("Order.summary-card.prices.total")}
        </h3>
        <PriceElement
          className="font-bold text-red-600"
          iconClassName="text-red-600"
          value={total}
          currency={currency}
        />
      </div>
    </Card>
  );
}
