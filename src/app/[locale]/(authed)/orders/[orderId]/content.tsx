"use client";

import { useGetOrder } from "@/api/fetch/orders/useGetOrder";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AddOrderDishesCard from "@/features/order/add-dishes-card";
import OrderForm from "@/features/order/order-form";
import formatOrderNumber from "@/utils/format-order-number";
import { ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  orderId: string;
};

export default function OrderPageContent({ orderId }: Props) {
  const t = useTranslations();
  const { data, isLoading } = useGetOrder({
    urlValues: {
      orderId,
    },
    skip: !orderId,
  });

  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
      <header className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2">
          <ShoppingBagIcon className="h-6 w-6" />
          <h1 className="text-4xl font-bold">{`${t(
            "navbar.order"
          )} ${formatOrderNumber(data?.number ?? "")}`}</h1>
        </div>
        <p className="text-stone-500">{t("Orders.edit-order-description")}</p>
      </header>

      <div className="flex min-h-[500px] max-w-screen-xl flex-row gap-4">
        <AddOrderDishesCard order={data} />
        <Card className="flex w-full flex-col gap-2 p-4">
          <h2 className="text-xl font-semibold">Содержимое заказа</h2>
          <Separator className="mb-2" />
        </Card>
      </div>

      <Card className="mt-4 flex max-w-xl flex-col gap-2 p-4">
        <h2 className="text-xl font-semibold">
          {t("Orders.form.general-info")}
        </h2>
        <Separator className="mb-2" />
        <OrderForm
          initialValues={{
            type: data?.type ?? undefined,
            note: data?.note ?? undefined,
            guestName: data?.guestName ?? undefined,
            guestPhone: data?.guestPhone ?? undefined,
            guestsAmount: data?.guestsAmount ?? undefined,
            restaurantId: data?.restaurantId ?? undefined,
            tableNumber: data?.tableNumber ?? undefined,
          }}
          onSubmit={console.log}
        />
      </Card>
    </div>
  );
}
