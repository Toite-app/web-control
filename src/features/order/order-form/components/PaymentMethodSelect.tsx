"use client";

import { useTranslations } from "next-intl";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "..";
import { useGetRestaurantPaymentMethods } from "@/api/fetch/restaurants/payment-methods/useGetRestaurantPaymentMethods";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";

interface PaymentMethodSelectProps {
  form: UseFormReturn<OrderFormValues>;
}

export default function PaymentMethodSelect({
  form,
}: PaymentMethodSelectProps) {
  const t = useTranslations();
  const restaurantId = form.watch("restaurantId");

  const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } =
    useGetRestaurantPaymentMethods({
      urlValues: {
        restaurantId: restaurantId ?? "",
      },
      skip: !restaurantId,
    });

  const paymentMethods = (paymentMethodsData ?? []).filter(
    (method) => method.isActive
  );

  const showNoMethodsWarning =
    restaurantId && !isLoadingPaymentMethods && paymentMethods.length === 0;

  useEffect(() => {
    // Reset payment method when restaurant changes
    form.setValue("paymentMethodId", undefined);
  }, [restaurantId, form]);

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="paymentMethodId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Orders.form.payment-method")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={
                !restaurantId ||
                isLoadingPaymentMethods ||
                paymentMethods.length === 0
              }
            >
              <SelectTrigger error={!!form.formState.errors.paymentMethodId}>
                <SelectValue
                  placeholder={t("Orders.form.payment-method-placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage>
              {form.formState.errors.paymentMethodId?.message}
            </FormMessage>
          </FormItem>
        )}
      />

      {showNoMethodsWarning && (
        <Alert variant="destructive">
          <WarningCircle className="h-4 w-4" />
          <AlertDescription>
            {t("Orders.form.no-payment-methods-warning")}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
