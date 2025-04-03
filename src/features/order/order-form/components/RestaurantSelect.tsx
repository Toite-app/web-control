"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "..";
import { useGetRestaurants } from "@/features/restaurants/api/useGetRestaurants";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RestaurantSelectProps {
  form: UseFormReturn<OrderFormValues>;
}

export default function RestaurantSelect({ form }: RestaurantSelectProps) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  const { data: restaurantsData, isLoading: isLoadingRestaurants } =
    useGetRestaurants({
      params: {
        isEnabled: true,
        isClosedForever: false,
        size: 100,
      },
    });

  const restaurants = React.useMemo(() => {
    return restaurantsData?.data ?? [];
  }, [restaurantsData]);

  const restaurantId = form.watch("restaurantId");

  // Find the selected restaurant name for display
  const selectedName = React.useMemo(() => {
    return restaurants.find((restaurant) => restaurant.id === restaurantId)
      ?.name;
  }, [restaurants, restaurantId]);

  return (
    <FormField
      control={form.control}
      name="restaurantId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("Orders.form.restaurant")}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={isLoadingRestaurants}
              >
                {selectedName ?? t("Orders.form.restaurant-placeholder")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder={t("Orders.form.restaurant-placeholder")}
                />
                <CommandEmpty>{t("Orders.no-restaurants-found")}</CommandEmpty>
                <div className="max-h-[300px] overflow-auto">
                  <CommandGroup>
                    <CommandList>
                      {restaurants.map((restaurant) => (
                        <CommandItem
                          key={restaurant.id}
                          value={restaurant.name}
                          onSelect={() => {
                            field.onChange(restaurant.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === restaurant.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {restaurant.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage>
            {form.formState.errors.restaurantId?.message}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}
