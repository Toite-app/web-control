"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import DaysOfWeekSelect from "./components/DaysOfWeekSelect";
import { DayOfWeek } from "@/types/general.types";
import OrderRequirementsSelect from "./components/OrderRequirementsSelect";
import { OrderFrom, OrderType } from "@/types/order.types";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  percent: z.number().min(0).max(100),
  isEnabled: z.boolean(),
  daysOfWeek: z.array(
    z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ] as const)
  ),
  orderTypes: z.array(
    z.enum(["delivery", "takeaway", "hall", "banquet"] as const)
  ),
  orderFroms: z.array(z.enum(["app", "website", "internal"] as const)),
  activeFrom: z.date(),
  activeTo: z.date(),
});

export type DiscountFormValues = z.infer<typeof formSchema>;

interface DiscountFormProps {
  initialValues?: Partial<DiscountFormValues>;
  onSubmit: (data: DiscountFormValues) => Promise<void>;
}

export default function DiscountForm({
  initialValues,
  onSubmit,
}: DiscountFormProps) {
  const t = useTranslations();

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      percent: 0,
      isEnabled: true,
      daysOfWeek: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      orderTypes: ["delivery", "takeaway", "hall", "banquet"],
      orderFroms: ["app", "website", "internal"],
      activeFrom: new Date(),
      activeTo: new Date(),
      ...initialValues,
    },
  });

  const handleSubmit = async (data: DiscountFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
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
                    placeholder={t("Discounts.form.description-placeholder")}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      placeholder={t("Discounts.form.activeFrom-placeholder")}
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
      </form>
    </Form>
  );
}
