"use client";

import { useTranslations } from "next-intl";
import {
  FormControl,
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
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck";
import { Backpack } from "@phosphor-icons/react/dist/ssr/Backpack";
import { Cheers } from "@phosphor-icons/react/dist/ssr/Cheers";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "..";

interface OrderTypeSelectProps {
  form: UseFormReturn<OrderFormValues>;
}

export default function OrderTypeSelect({ form }: OrderTypeSelectProps) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("Orders.form.type-label")}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <SelectTrigger error={!!form.formState.errors.type}>
                <SelectValue placeholder={t("Orders.form.type-placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">
                  <div className="flex flex-row items-center gap-2">
                    <Truck className="h-5 w-5" weight="fill" />
                    {t("Orders.types.delivery")}
                  </div>
                </SelectItem>
                <SelectItem value="takeaway">
                  <div className="flex flex-row items-center gap-2">
                    <Backpack className="h-5 w-5" weight="fill" />
                    {t("Orders.types.takeaway")}
                  </div>
                </SelectItem>
                <SelectItem value="hall">
                  <div className="flex flex-row items-center gap-2">
                    <svg
                      className="h-5 w-5 dark:fill-white dark:text-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 7.5C22 5.57 17.52 4 12 4S2 5.57 2 7.5c0 1.81 3.95 3.31 9 3.48V15H9.35c-.82 0-1.55.5-1.86 1.26L6 20h2l1.2-3h5.6l1.2 3h2l-1.5-3.74c-.3-.76-1.04-1.26-1.85-1.26H13v-4.02c5.05-.17 9-1.67 9-3.48z"></path>
                    </svg>
                    {t("Orders.types.hall")}
                  </div>
                </SelectItem>
                <SelectItem value="banquet">
                  <div className="flex flex-row items-center gap-2">
                    <Cheers className="h-5 w-5" weight="fill" />
                    <span>{t("Orders.types.banquet")}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage>{form.formState.errors.type?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
