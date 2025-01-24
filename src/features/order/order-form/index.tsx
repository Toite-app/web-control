"use client";

import { useTranslations } from "next-intl";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/phone-input";
import OrderTypeSelect from "./components/OrderTypeSelect";
import RestaurantSelect from "./components/RestaurantSelect";
import { useEffect } from "react";

const formSchema = z.object({
  type: z.enum(["delivery", "takeaway", "hall", "banquet"] as const),
  tableNumber: z.string().optional(),
  note: z.string().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestsAmount: z.number().optional(),
  restaurantId: z.string().optional(),
});

export type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  initialValues?: Partial<OrderFormValues>;
  onSubmit: (
    data: OrderFormValues,
    form: UseFormReturn<OrderFormValues>
  ) => Promise<void>;
}

export default function OrderForm({ initialValues, onSubmit }: OrderFormProps) {
  const t = useTranslations();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      tableNumber: "",
      note: "",
      guestName: "",
      guestPhone: "",
      guestsAmount: 1,
      restaurantId: undefined,
      ...initialValues,
    },
  });

  const orderType = form.watch("type");

  const handleSubmit = async (data: OrderFormValues) => {
    await onSubmit(data, form);
  };

  useEffect(() => {
    if (!initialValues) return;
    form.reset(initialValues);
  }, [initialValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <OrderTypeSelect form={form} />

        {orderType && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                {t("Orders.form.required-section")}
              </h2>

              <FormField
                control={form.control}
                name="guestsAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Orders.form.guests-amount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder={t("Orders.form.guests-amount-placeholder")}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={!!form.formState.errors.guestsAmount}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.guestsAmount?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {(orderType === "hall" || orderType === "banquet") && (
                <FormField
                  control={form.control}
                  name="tableNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Orders.form.table-number")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "Orders.form.table-number-placeholder"
                          )}
                          {...field}
                          error={!!form.formState.errors.tableNumber}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.tableNumber?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}

              {(orderType === "delivery" ||
                orderType === "takeaway" ||
                orderType === "banquet") && (
                <FormField
                  control={form.control}
                  name="guestPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Orders.form.guest-phone")}</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder={t("Orders.form.guest-phone-placeholder")}
                          value={field.value}
                          onChange={field.onChange}
                          error={!!form.formState.errors.guestPhone}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.guestPhone?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}

              <RestaurantSelect form={form} />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                {t("Orders.form.optional-section")}
              </h2>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Orders.form.note")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("Orders.form.note-placeholder")}
                        {...field}
                        error={!!form.formState.errors.note}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.note?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Orders.form.guest-name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Orders.form.guest-name-placeholder")}
                        {...field}
                        error={!!form.formState.errors.guestName}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.guestName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {orderType === "hall" && (
                <FormField
                  control={form.control}
                  name="guestPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Orders.form.guest-phone")}</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder={t("Orders.form.guest-phone-placeholder")}
                          value={field.value}
                          onChange={field.onChange}
                          error={!!form.formState.errors.guestPhone}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.guestPhone?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button type="submit" className="w-full">
              {t("Orders.form.submit")}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
