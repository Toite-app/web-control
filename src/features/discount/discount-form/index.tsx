"use client";

import { UseFormReturn, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import DaysOfWeekSelect from "./components/DaysOfWeekSelect";
import OrderRequirementsSelect from "./components/OrderRequirementsSelect";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import RestaurantSelect from "./components/RestaurantSelect";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import AppendMenuSelect from "@/features/discount/discount-form/components/AppendMenuSelect";

export interface DiscountFormValues {
  name: string;
  description: string;
  percent: number;
  isEnabled: boolean;
  daysOfWeek: (
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  )[];
  orderTypes: ("delivery" | "takeaway" | "hall" | "banquet")[];
  orderFroms: ("app" | "website" | "internal")[];
  activeFrom: Date;
  activeTo: Date;
  applyStartAndEndTime: boolean;
  startTime: string | null;
  endTime: string | null;
  applyForFirstOrder: boolean;
  applyByPromocode: boolean;
  applyByDefault: boolean;
  promocode: string | null;
  restaurantIds: string[];
  menus: {
    menuId: string;
    selectedCategories: string[];
  }[];
}

interface DiscountFormProps {
  initialValues?: Partial<DiscountFormValues>;
  onSubmit: (
    data: DiscountFormValues,
    form: UseFormReturn<DiscountFormValues>
  ) => Promise<void>;
}

export default function DiscountForm({
  initialValues,
  onSubmit,
}: DiscountFormProps) {
  const t = useTranslations();

  const form = useForm<DiscountFormValues>({
    defaultValues: {
      name: "",
      description: "",
      percent: 0,
      isEnabled: true,
      daysOfWeek: [],
      orderTypes: [],
      orderFroms: [],
      activeFrom: new Date(),
      activeTo: new Date(),
      applyForFirstOrder: false,
      applyByPromocode: false,
      applyByDefault: true,
      applyStartAndEndTime: false,
      startTime: null,
      endTime: null,
      promocode: null,
      restaurantIds: [],
      ...initialValues,
    },
  });

  const handleSubmit = async (data: DiscountFormValues) => {
    await onSubmit(data, form);
  };

  const handleError = async () => {
    await onSubmit(form.getValues(), form);
  };

  const applyByPromocode = form.watch("applyByPromocode");

  const rootError = form.formState.errors.root?.message;

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  return (
    <div className="grid grid-cols-[1fr_400px] gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, handleError)}
          className="space-y-8"
        >
          <Card className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">
                  {t("Discounts.form.menus-and-categories")}
                </h2>
                <p className="text-sm text-stone-500">
                  {t("Discounts.form.menus-and-categories-description")}
                </p>
              </div>
              <Separator />
              <AppendMenuSelect control={form.control} />
            </div>
          </Card>
          <Card className="flex flex-col gap-4 p-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">
                  {t("Discounts.form.basic-info")}
                </h2>
                <Separator />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Discounts.form.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Discounts.form.name-placeholder")}
                        {...field}
                        error={!!form.formState.errors.name}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("Discounts.form.name-description")}
                    </FormDescription>
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Discounts.form.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "Discounts.form.description-placeholder"
                        )}
                        {...field}
                        error={!!form.formState.errors.description}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.description?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex w-full flex-row gap-2">
                <FormField
                  control={form.control}
                  name="percent"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("Discounts.form.percent")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          placeholder={t("Discounts.form.percent-placeholder")}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          error={!!form.formState.errors.percent}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("Discounts.form.percent-description")}
                      </FormDescription>
                      <FormMessage>
                        {form.formState.errors.percent?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isEnabled"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border px-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t("Discounts.form.isEnabled")}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">
                  {t("Discounts.form.schedule")}
                </h3>
                <Separator />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="activeFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Discounts.form.activeFrom")}</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t(
                            "Discounts.form.activeFrom-placeholder"
                          )}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.activeFrom?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activeTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Discounts.form.activeTo")}</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("Discounts.form.activeTo-placeholder")}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.activeTo?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <DaysOfWeekSelect form={form} />

              <FormField
                control={form.control}
                name="applyStartAndEndTime"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={(value) => {
                          field.onChange(value);

                          // TODO: Make this better (don't reset value each time)
                          if (value) {
                            form.setValue("startTime", "00:00");
                            form.setValue("endTime", "23:59");
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t("Discounts.form.applyStartAndEndTime")}
                      </FormLabel>
                      <FormDescription>
                        {t("Discounts.form.applyStartAndEndTime-description")}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("applyStartAndEndTime") && (
                <div className="flex flex-row items-center gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("Discounts.form.startTime")}</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            value={field.value || "00:00"}
                            error={!!form.formState.errors.startTime}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.startTime?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("Discounts.form.endTime")}</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            value={field.value || "00:00"}
                            error={!!form.formState.errors.endTime}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.endTime?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">
                  {t("Discounts.form.orderRequirements")}
                </h3>
                <Separator />
              </div>
              <OrderRequirementsSelect form={form} />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">
                  {t("Discounts.form.behaviour")}
                </h3>
                <Separator />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="applyForFirstOrder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t("Discounts.form.applyForFirstOrder")}
                        </FormLabel>
                        <FormDescription>
                          {t("Discounts.form.applyForFirstOrder-description")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applyByPromocode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t("Discounts.form.applyByPromocode")}
                        </FormLabel>
                        <FormDescription>
                          {t("Discounts.form.applyByPromocode-description")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {applyByPromocode && (
                  <FormField
                    control={form.control}
                    name="promocode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Discounts.form.promocode")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "Discounts.form.promocode-placeholder"
                            )}
                            {...field}
                            value={field.value ?? ""}
                            error={!!form.formState.errors.promocode}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("Discounts.form.promocode-description")}
                        </FormDescription>
                        <FormMessage>
                          {form.formState.errors.promocode?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="applyByDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t("Discounts.form.applyByDefault")}
                        </FormLabel>
                        <FormDescription>
                          {t("Discounts.form.applyByDefault-description")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              {rootError && (
                <p className="text-center text-sm font-medium text-destructive">
                  {rootError}
                </p>
              )}
              <Button type="submit" className="w-full">
                {t("Discounts.form.submit")}
              </Button>
            </div>
          </Card>
        </form>
      </Form>

      <div className="relative">
        <Card className="sticky top-6">
          <RestaurantSelect form={form} className="h-[600px]" />
        </Card>
      </div>
    </div>
  );
}
