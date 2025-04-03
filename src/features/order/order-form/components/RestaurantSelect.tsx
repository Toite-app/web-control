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
import { useGetRestaurants } from "@/features/restaurants/api/useGetRestaurants";

interface RestaurantSelectProps {
  form: UseFormReturn<OrderFormValues>;
}

export default function RestaurantSelect({ form }: RestaurantSelectProps) {
  const t = useTranslations();

  const { data: restaurantsData, isLoading: isLoadingRestaurants } =
    useGetRestaurants({
      params: {
        isEnabled: true,
        isClosedForever: false,
        size: 100,
      },
    });

  const restaurants = restaurantsData?.data ?? [];

  return (
    <FormField
      control={form.control}
      name="restaurantId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("Orders.form.restaurant")}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isLoadingRestaurants}
          >
            <SelectTrigger error={!!form.formState.errors.restaurantId}>
              <SelectValue
                placeholder={t("Orders.form.restaurant-placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {restaurants.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage>
            {form.formState.errors.restaurantId?.message}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
