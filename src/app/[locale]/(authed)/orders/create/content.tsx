"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck";
import { Backpack } from "@phosphor-icons/react/dist/ssr/Backpack";
import { Cheers } from "@phosphor-icons/react/dist/ssr/Cheers";
import { useGetRestaurants } from "@/features/restaurants/api/useGetRestaurants";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/phone-input";
import { createOrderMutation } from "@/api/fetch/orders/createOrder";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

// Update form schema with required fields based on type
const formSchema = z.object({
  type: z.enum(["delivery", "takeaway", "hall", "banquet"] as const),
  tableNumber: z.string().optional(),
  note: z.string().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestsAmount: z.number().optional(),
  restaurantId: z.string().optional(),
});

type OrderFormValues = z.infer<typeof formSchema>;

export default function OrdersCreatePageContent() {
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const { data: restaurantsData, isLoading: isLoadingRestaurants } =
    useGetRestaurants();
  const restaurants = restaurantsData?.data ?? [];

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
    },
  });

  console.log(form.formState.errors);

  const orderType = form.watch("type");

  const onSubmit = useCallback(
    async (data: OrderFormValues) => {
      try {
        await createOrderMutation({
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

        form.reset();
      } catch (error) {
        handleError({ error, form });
      }
    },
    [form, t, toast, handleError]
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Orders.form.type-label")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("Orders.form.type-placeholder")}
                        />
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
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                  <FormMessage>
                    {form.formState.errors.type?.message &&
                      t(form.formState.errors.type?.message)}
                  </FormMessage>
                </FormItem>
              )}
            />

            {orderType && (
              <div className="space-y-8">
                {/* Required Fields Section */}
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
                            placeholder={t(
                              "Orders.form.guests-amount-placeholder"
                            )}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            error={!!form.formState.errors.guestsAmount}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.guestsAmount?.message &&
                            t(form.formState.errors.guestsAmount?.message)}
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
                            />
                          </FormControl>
                          <FormMessage />
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
                              placeholder={t(
                                "Orders.form.guest-phone-placeholder"
                              )}
                              value={field.value}
                              onChange={field.onChange}
                              error={!!form.formState.errors.guestPhone}
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.guestPhone?.message &&
                              t(form.formState.errors.guestPhone?.message)}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="restaurantId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Orders.form.restaurant")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoadingRestaurants}
                        >
                          <SelectTrigger
                            error={!!form.formState.errors.restaurantId}
                          >
                            <SelectValue
                              placeholder={t(
                                "Orders.form.restaurant-placeholder"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {restaurants.map((restaurant) => (
                              <SelectItem
                                key={restaurant.id}
                                value={restaurant.id}
                              >
                                {restaurant.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>
                          {form.formState.errors.restaurantId?.message &&
                            t(form.formState.errors.restaurantId?.message)}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Optional Fields Section */}
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
                          />
                        </FormControl>
                        <FormMessage />
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
                            placeholder={t(
                              "Orders.form.guest-name-placeholder"
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                              placeholder={t(
                                "Orders.form.guest-phone-placeholder"
                              )}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
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
      </div>
    </div>
  );
}
