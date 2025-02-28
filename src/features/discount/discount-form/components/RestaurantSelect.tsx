"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormValues } from "..";
import { cn } from "@/lib/utils";
import { useGetRestaurants } from "@/features/restaurants/api/useGetRestaurants";

interface RestaurantSelectProps {
  className?: string;
  form: UseFormReturn<DiscountFormValues>;
}

export default function RestaurantSelect({
  form,
  className,
}: RestaurantSelectProps) {
  const t = useTranslations();
  const [search, setSearch] = useState("");

  const restaurants = useGetRestaurants({
    params: {
      // search,
      // isEnabled: true,
    },
  });

  const selectedRestaurants = form.watch("restaurantIds") ?? [];
  const restaurantError = form.formState.errors.restaurantIds?.message;

  const toggleRestaurant = (restaurantId: string) => {
    const current = selectedRestaurants;
    const updated = current.includes(restaurantId)
      ? current.filter((id) => id !== restaurantId)
      : [...current, restaurantId];

    form.setValue("restaurantIds", updated);
    form.trigger("restaurantIds");
  };

  return (
    <div className={cn("flex flex-col gap-4 p-4", className)}>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">
          {t("Discounts.form.restaurants")}
        </h3>
        {restaurantError && (
          <p className="text-sm font-medium text-destructive">
            {restaurantError}
          </p>
        )}
        <Input
          placeholder={t("Discounts.form.restaurants-search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {restaurants.data?.data.map((restaurant) => (
            <div
              key={restaurant.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-2 transition-colors",
                selectedRestaurants.includes(restaurant.id) &&
                  "border-primary bg-primary/5"
              )}
              onClick={() => toggleRestaurant(restaurant.id)}
            >
              <Checkbox
                id={restaurant.id}
                checked={selectedRestaurants.includes(restaurant.id)}
                // onCheckedChange={() => toggleRestaurant(restaurant.id)}
              />
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={restaurant.id}
                  className="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {restaurant.name}
                </label>
                <p className="select-none text-xs text-muted-foreground">
                  {restaurant.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
