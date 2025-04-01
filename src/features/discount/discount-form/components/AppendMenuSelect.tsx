"use client";

import { Button } from "@/components/ui/button";
import { DiscountFormValues } from "@/features/discount/discount-form";
import DishesMenuSelect from "@/features/dishes/menu-select";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

type Props = {
  control: Control<DiscountFormValues>;
};

export default function AppendMenuSelect(props: Props) {
  const { control } = props;

  const t = useTranslations();

  const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>(
    undefined
  );

  const { fields, append } = useFieldArray({
    control,
    name: "menus",
  });

  const excludedIds = fields.map((field) => field.menuId);

  return (
    <div className="flex flex-row items-center gap-4">
      <DishesMenuSelect
        onChange={(menuId) => setSelectedMenuId(menuId || undefined)}
        value={selectedMenuId}
        excludedIds={excludedIds}
      />
      <Button
        type="button"
        className="flex flex-row items-center gap-2"
        disabled={!selectedMenuId}
        onClick={() => {
          if (!selectedMenuId) return;

          append({
            menuId: selectedMenuId,
            selectedCategories: [],
          });

          setSelectedMenuId(undefined);
        }}
      >
        <PlusIcon className="h-4 w-4" />
        {t("Discounts.form.append-menu")}
      </Button>
    </div>
  );
}
