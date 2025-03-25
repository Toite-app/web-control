"use client";

import * as React from "react";
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
import { IWorkshiftPaymentCategory } from "@/types/restaurant.types";
import { useTranslations } from "next-intl";

interface CategoryComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  options: IWorkshiftPaymentCategory[];
}

export default function CategoryCombobox({
  value,
  onChange,
  options = [],
}: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations();

  // Separate categories into groups and standalone options
  const groups = React.useMemo(
    () => options.filter((option) => (option.childrens?.length ?? 0) > 0),
    [options]
  );

  const standaloneOptions = React.useMemo(
    () => options.filter((option) => !(option.childrens?.length ?? 0)),
    [options]
  );

  // Find the selected category name for display
  const selectedName = React.useMemo(() => {
    const findInCategories = (
      categories: IWorkshiftPaymentCategory[]
    ): string | undefined => {
      for (const category of categories) {
        if (category.id === value) return category.name;
        const found = category.childrens?.find((child) => child.id === value);
        if (found) return found.name;
      }
      return undefined;
    };

    return findInCategories(options);
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedName ?? t("workshift-payments.payment-category-placeholder")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={t("workshift-payments.payment-category-placeholder")}
          />
          <CommandEmpty>{t("PaymentCategories.no-categories")}</CommandEmpty>
          <div className="max-h-[300px] overflow-auto">
            {groups.map((group) => {
              return (
                <CommandGroup key={group.id} heading={group.name}>
                  <CommandList>
                    {(group?.childrens ?? []).map((child) => (
                      <CommandItem
                        key={child.id}
                        value={child.name}
                        onSelect={() => {
                          onChange(child.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === child.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {child.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              );
            })}
            {standaloneOptions.length > 0 && (
              <CommandGroup heading={t("workshift-payments.other-options")}>
                <CommandList>
                  {standaloneOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => {
                        onChange(option.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
