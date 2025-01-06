"use client";

import { useState } from "react";
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
import { useAddressSuggestions } from "@/api/fetch/useAddressSuggestions";
import useDebouncedValue from "@/hooks/use-debounced-value";
import { useTranslations } from "next-intl";

interface AddressSuggestionComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: string;
  provider?: "dadata" | "google";
  disabled?: boolean;
}

export function AddressSuggestionCombobox({
  value,
  onChange,
  placeholder,
  language = "ru",
  provider = "dadata",
  disabled,
}: AddressSuggestionComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const t = useTranslations();

  const { data: suggestions } = useAddressSuggestions({
    params: {
      query: debouncedSearch,
      language,
      provider,
    },
    skip: !debouncedSearch || disabled || search.length === 0,
  });

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t(placeholder ?? "fields.address-placeholder")}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{t("fields.address-not-found")}</CommandEmpty>
            <CommandGroup>
              {suggestions?.map((suggestion) => (
                <CommandItem
                  key={suggestion.value}
                  value={suggestion.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === suggestion.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {suggestion.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
