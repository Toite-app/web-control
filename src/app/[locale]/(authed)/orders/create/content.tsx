"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { createOrderMutation } from "@/api/fetch/orders/createOrder";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";
import OrderForm, { OrderFormValues } from "@/features/order/order-form";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "@/navigation";

export default function OrdersCreatePageContent() {
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();
  const router = useRouter();

  const onSubmit = useCallback(
    async (data: OrderFormValues, form: UseFormReturn<OrderFormValues>) => {
      try {
        const order = await createOrderMutation({
          data: {
            type: data.type,
            tableNumber: data.tableNumber,
            note: data.note,
            guestName: data.guestName,
            guestPhone: data.guestPhone,
            guestsAmount: data.guestsAmount,
            restaurantId: data.restaurantId,
          },
        });

        toast({
          title: t("Orders.form.create-success"),
          description: t("Orders.form.create-success-description"),
          variant: "success",
        });

        router.push({
          pathname: "/orders/[orderId]",
          params: { orderId: order.id },
        });
      } catch (error) {
        handleError({ error, form });
      }
    },
    [t, toast, handleError, router]
  );

  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
      <header className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2">
          <ShoppingBagIcon className="h-6 w-6" />
          <h1 className="text-4xl font-bold">{t("navbar.orders-create")}</h1>
        </div>
        <p className="text-stone-500">{t("Orders.create-order-description")}</p>
      </header>

      <div className="mt-8 max-w-xl">
        <OrderForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
