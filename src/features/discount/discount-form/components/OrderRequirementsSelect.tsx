"use client";

import { useTranslations } from "next-intl";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { OrderFrom, OrderType } from "@/types/order.types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormValues } from "..";
import OrderTypeIcon from "@/features/order-card/shared/type-icon";

const ORDER_TYPES: OrderType[] = ["delivery", "takeaway", "hall", "banquet"];
const ORDER_FROMS: OrderFrom[] = ["app", "website", "internal"];

interface OrderRequirementsSelectProps {
  form: UseFormReturn<DiscountFormValues>;
}

export default function OrderRequirementsSelect({
  form,
}: OrderRequirementsSelectProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="orderTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Discounts.form.orderTypes")}</FormLabel>
            <FormControl>
              <ToggleGroup
                type="multiple"
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-wrap gap-2"
              >
                {ORDER_TYPES.map((type) => (
                  <ToggleGroupItem
                    key={type}
                    value={type}
                    variant="outline"
                    size="sm"
                    className="group min-w-[80px] flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <OrderTypeIcon
                        type={type}
                        className="fill-stone-700 group-data-[state=on]:fill-primary-foreground dark:fill-stone-200"
                      />
                      {t(`Order.summary-card.order-type-values.${type}`)}
                    </div>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
            <FormDescription>
              {t("Discounts.form.orderTypes-description")}
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="orderFroms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Discounts.form.orderFroms")}</FormLabel>
            <FormControl>
              <ToggleGroup
                type="multiple"
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-wrap gap-2"
              >
                {ORDER_FROMS.map((from) => (
                  <ToggleGroupItem
                    key={from}
                    value={from}
                    variant="outline"
                    size="sm"
                    className="min-w-[80px] flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {t(`Order.summary-card.order-from-values.${from}`)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
            <FormDescription>
              {t("Discounts.form.orderFroms-description")}
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}
