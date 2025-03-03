"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IDiscount } from "@/types/discount.types";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface DiscountCardProps {
  className?: string;
  discount: IDiscount;
}

export default function DiscountCard({
  discount,
  className,
}: DiscountCardProps) {
  const t = useTranslations();

  const description = useMemo(() => {
    if (!discount.description) return "";
    return discount.description.length > 100
      ? `${discount.description.slice(0, 97)}...`
      : discount.description;
  }, [discount.description]);

  const daysOfWeek = useMemo(() => {
    return discount.daysOfWeek
      .map((day) => t(`dayOfWeekShort.${day}`))
      .join(", ");
  }, [discount.daysOfWeek, t]);

  const orderTypes = useMemo(() => {
    return discount.orderTypes
      .map((type) => t(`Orders.types.${type}`))
      .join(", ");
  }, [discount.orderTypes, t]);

  const isExpired = useMemo(() => {
    const now = new Date();
    const activeFrom = new Date(discount.activeFrom);
    const activeTo = new Date(discount.activeTo);
    return now < activeFrom || now > activeTo;
  }, [discount.activeFrom, discount.activeTo]);

  const statusBadge = useMemo(() => {
    if (isExpired) {
      return <Badge variant="destructive">{t("Discounts.card.expired")}</Badge>;
    }
    return (
      <Badge variant={discount.isEnabled ? "default" : "secondary"}>
        {discount.isEnabled ? t("toite.enabled") : t("toite.disabled")}
      </Badge>
    );
  }, [discount.isEnabled, isExpired, t]);

  return (
    <Card className={cn("flex h-full flex-col", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-1">
        <CardTitle className="text-lg font-bold">{discount.name}</CardTitle>
        <Badge variant={discount.isEnabled ? "default" : "secondary"}>
          {discount.percent}%
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{daysOfWeek}</Badge>
            <Badge variant="outline">{orderTypes}</Badge>
            {statusBadge}
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex flex-row items-center gap-1">
              <p className="font-medium">{t("fields.createdAt")}:</p>
              <p>{format(new Date(discount.createdAt), "dd.MM.yyyy HH:mm")}</p>
            </div>
          </div>
          {discount.promocode && (
            <p className="text-xs text-primary">
              *{t("Discounts.card.activation-by-promocode")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
