"use client";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Filter } from "../index.types";
import { FilterValue } from "@/components/data-table/hooks/useFilters";

type Props<F extends string> = {
  filters: Record<string, FilterValue>;
  fields: Filter<F>[];
  onRemove: (field: F) => void;
  onClear: () => void;
};

export const ActiveFilters = memo(<F extends string>(props: Props<F>) => {
  const { filters, fields, onRemove, onClear } = props;
  const t = useTranslations();

  if (Object.keys(filters).length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      {Object.entries(filters).map(([field, filter]) => {
        const fieldConfig = fields.find((f) => f.field === field);
        if (!fieldConfig) return null;

        let displayValue = filter.value;

        // Handle select options
        if (fieldConfig.data.type === "select") {
          const option = fieldConfig.data.options.find(
            (opt) => opt.value === filter.value
          );
          if (option) {
            displayValue = t(option.translatePath);
          }
        }

        return (
          <div
            key={field}
            className="flex items-center gap-1.5 rounded-md border bg-stone-50 px-2 py-1 text-sm dark:bg-stone-900"
          >
            <span className="font-medium">{t(fieldConfig.label)}:</span>
            <span className="text-muted-foreground">
              {t(`table.filter.conditions.${filter.condition}`)}
            </span>
            <span>{displayValue}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => onRemove(field as F)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
        onClick={onClear}
      >
        {t("table.filter.clear")}
      </Button>
    </div>
  );
});

ActiveFilters.displayName = "ActiveFilters";
