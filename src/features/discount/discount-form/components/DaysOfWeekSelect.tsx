"use client";

import { useTranslations } from "next-intl";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DayOfWeek } from "@/types/general.types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormValues } from "..";

const DAYS_OF_WEEK_COL1: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface DaysOfWeekSelectProps {
  form: UseFormReturn<DiscountFormValues>;
}

export default function DaysOfWeekSelect({ form }: DaysOfWeekSelectProps) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name="daysOfWeek"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("Discounts.form.daysOfWeek")}</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2">
              <ToggleGroup
                type="multiple"
                value={field.value}
                onValueChange={field.onChange}
                className="flex w-full flex-row gap-2"
              >
                {DAYS_OF_WEEK_COL1.map((day) => (
                  <ToggleGroupItem
                    key={day}
                    value={day}
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-center data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {t(`dayOfWeekShort.${day}`)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </FormControl>
          <FormDescription>
            {t("Discounts.form.daysOfWeek-description")}
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
