"use client";
import { memo, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FilterIcon, ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Form, { FormInstance } from "@/components/form";
import { FilterCondition } from "../index.types";
import { DataTableFiltersProps } from "..";
import { FilterValues, useGetFilterFormFields } from "../hooks/useFormFields";

type Props<F extends string> = Pick<DataTableFiltersProps<F>, "config">;

export const AddFilterButton = memo(<F extends string>(props: Props<F>) => {
  const { config } = props;

  const t = useTranslations();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<FormInstance<FilterValues> | null>(null);
  const [selectedField, setSelectedField] = useState<string | undefined>(
    config?.[0].field
  );

  const fields = useGetFilterFormFields({
    config,
    selectedField,
  });

  useEffect(() => {
    if (!form) return;

    const subscription = form.watch((value) => {
      setSelectedField(value.field);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
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
      <PopoverContent
        className="flex flex-col gap-2"
        side="bottom"
        align="start"
      >
        <h2 className="text-lg font-bold">{t("table.filter.add")}</h2>
        <Form
          intlFields
          fields={fields}
          defaultValues={{
            field: config?.[0].field,
            condition: FilterCondition.Equals,
            value: "",
          }}
          onSubmit={console.log}
          submitButton={{
            text: "table.filter.submit",
          }}
          onFormInit={setForm}
        />
      </PopoverContent>
    </Popover>
  );
});

AddFilterButton.displayName = "AddFilterButton";
