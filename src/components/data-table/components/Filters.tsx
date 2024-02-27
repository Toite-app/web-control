"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FilterIcon, ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export type DataTableFiltersProps = {};

export const DataTableFilters = (props: DataTableFiltersProps) => {
  const {} = props;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const t = useTranslations();

  return (
    <div className="flex flex-row items-center gap-1">
      <Popover onOpenChange={setIsAddOpen}>
        <PopoverTrigger>
          <Button
            className="flex flex-row gap-2"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAddOpen(true);
            }}
          >
            <FilterIcon className="h-4 w-4" />
            {t("table.filter.add")}
            <ChevronDownIcon
              data-open={isAddOpen}
              className="h-4 w-4 transition-transform duration-75 data-[open=true]:-rotate-180"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col" side="bottom" align="start">
          <h2 className="text-lg font-bold">{t("table.filter.add")}</h2>
        </PopoverContent>
      </Popover>
    </div>
  );
};
