"use client";

import { Button } from "@/components/ui/button";
import { DiscountFormValues } from "@/features/discount/discount-form";
import DishesMenuSelect from "@/features/dishes/menu-select";
import { IDishesMenu } from "@/types/dishes-menu.types";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Control, useFieldArray, useWatch } from "react-hook-form";

type Props = {
  control: Control<DiscountFormValues>;
};

export default function AppendMenuSelect(props: Props) {
  const { control } = props;

  const t = useTranslations();

  const [selectedMenu, setSelectedMenu] = useState<IDishesMenu | undefined>(
    undefined
  );

  const fields = useWatch({ control, name: "menus" });
  const { append } = useFieldArray({
    control,
    name: "menus",
  });

  const excludedIds = (fields || []).map((field) => field.menu.id);

  return (
    <div className="flex flex-row items-center gap-4">
      <DishesMenuSelect
        onChange={(menu) => setSelectedMenu(menu || undefined)}
        value={selectedMenu?.id}
        excludedIds={excludedIds}
      />
      <Button
        type="button"
        className="flex flex-row items-center gap-2"
        disabled={!selectedMenu}
        onClick={() => {
          if (!selectedMenu) return;

          append({
            menu: selectedMenu,
            selectedCategoryIds: [],
            selectedRestaurantIds: [],
          });

          setSelectedMenu(undefined);
        }}
      >
        <PlusIcon className="h-4 w-4" />
        {t("Discounts.form.append-menu")}
      </Button>
    </div>
  );
}
