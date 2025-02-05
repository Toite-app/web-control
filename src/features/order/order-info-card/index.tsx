"use client";
import { IOrder } from "@/types/order.types";
import { Card } from "@/components/ui/card";
import OrderStepper from "./stepper";
import { useTranslations } from "next-intl";

type Props = {
  order?: IOrder | null;
};

export default function OrderInfoCard({ order }: Props) {
  const t = useTranslations();

  if (!order) return null;

  // Example of how the dates would be passed
  const statusDates = {
    pending: order.createdAt,
    // delivering: new Date(),
    // completed: new Date(),
  };

  return (
    <Card className="flex w-full flex-col p-4">
      <h3 className="mb-2 text-lg font-medium text-muted-foreground">
        {t("Order.order-status")}
      </h3>
      <OrderStepper currentStatus={order.status} statusDates={statusDates} />
    </Card>
  );
}
