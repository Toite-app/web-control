"use client";

import { updateOrderMutation } from "@/api/fetch/orders/updateOrder";
import { useGetOrder } from "@/api/fetch/orders/useGetOrder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddOrderDishesCard from "@/features/order/add-dishes-card";
import AddedDishesList from "@/features/order/added-dishes-list";
import OrderActions from "@/features/order/order-actions";
import OrderForm, { OrderFormValues } from "@/features/order/order-form";
import OrderInfoCard from "@/features/order/order-info-card";
import OrderSummaryCard from "@/features/order/order-summary-card";
import useSubscription from "@/hooks/use-subscription";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import formatOrderNumber from "@/utils/format-order-number";
import { ChevronLeft, MenuIcon, ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

type Props = {
  orderId: string;
};

export default function OrderPageContent({ orderId }: Props) {
  const t = useTranslations();
  const handleError = useErrorHandler();

  const { data, isLoading } = useGetOrder({
    urlValues: {
      orderId,
    },
    skip: !orderId,
    config: {
      keepPreviousData: true,
    },
  });

  const onSubmit = async (
    data: OrderFormValues,
    form: UseFormReturn<OrderFormValues>
  ) => {
    try {
      await updateOrderMutation({
        urlValues: {
          orderId,
        },
        data,
      });
    } catch (error) {
      handleError({
        error,
        form,
      });
    }
  };

  useSubscription({
    type: "ORDER",
    data: {
      orderId,
    },
  });

  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <header className="flex flex-col">
            <div className="flex flex-row items-center gap-2">
              <ShoppingBagIcon className="h-6 w-6" />
              <h1 className="text-4xl font-bold">{`${t(
                "navbar.order"
              )} ${formatOrderNumber(data?.number ?? "")}`}</h1>
            </div>
            <p className="text-stone-500">
              {t("Orders.edit-order-description")}
            </p>
          </header>
        </div>
        <Button variant="outline" size="icon">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(630px,1fr)_minmax(0,400px)] gap-2">
        <div className="flex max-w-3xl flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold">{t("Order.info")}</h2>
            <OrderInfoCard order={data} />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold">
              {t("AddedDishesList.orderContent")}
            </h2>
            <AddOrderDishesCard order={data} />
            <AddedDishesList order={data} />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold">
              {t("Orders.form.general-info")}
            </h2>
            <Card className="flex flex-col gap-2 p-4">
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
                onSubmit={onSubmit}
              />
            </Card>
          </div>
        </div>
        <div className="relative">
          <div className="sticky top-6 flex flex-col gap-6">
            <div className="flex w-full flex-col gap-3">
              <h2 className="text-3xl font-semibold">{t("Order.summary")}</h2>
              <OrderSummaryCard order={data} />
            </div>
            <div className="flex w-full flex-col gap-3">
              <h2 className="text-xl font-semibold">{t("Order.actions")}</h2>
              <OrderActions order={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
