"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DiscountFormValues } from "@/features/discount/discount-form";
import SelectedMenu from "@/features/discount/discount-form/components/SelectedMenu";
import { Control, useFieldArray, useWatch } from "react-hook-form";

type Props = {
  control: Control<DiscountFormValues>;
};

export default function SelectedMenus(props: Props) {
  const { control } = props;

  const fields = useWatch({ control, name: "menus" });
  const { remove } = useFieldArray({ control, name: "menus" });

  return (
    <ScrollArea className="max-w-screen-md pb-2">
      <div className="flex flex-row gap-2">
        {(fields || []).map((field, index) => (
          <SelectedMenu
            field={field}
            key={field.menu.id}
            control={control}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
