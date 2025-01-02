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
import Form from "@/components/form";
import { Filter, FilterCondition } from "../index.types";
import { FilterValues, useGetFilterFormFields } from "../hooks/useFormFields";
import { useForm } from "react-hook-form";

type Props<F extends string> = {
  config: Filter<F>[];
  onAdd: (field: F, value: string, condition: FilterCondition) => void;
};

export const AddFilterButton = memo(<F extends string>(props: Props<F>) => {
  const { config, onAdd } = props;

  const t = useTranslations();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | undefined>();

  const form = useForm<FilterValues>({
    defaultValues: {
      field: "",
      value: "",
    },
  });

  const fields = useGetFilterFormFields({
    config,
    selectedField,
  });

  // Watch for field changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      setSelectedField(value.field);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Set initial field value when popover opens
  useEffect(() => {
    const field = config?.[0]?.field;
    const condition = config?.[0]?.conditions[0];

    if (isAddOpen && field) {
      form.reset({
        field,
        condition: condition as FilterCondition,
      });
      setSelectedField(field);
    }
  }, [isAddOpen, config, form]);

  return (
    <Popover
      open={isAddOpen}
      onOpenChange={(open) => {
        setIsAddOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          className="flex flex-row gap-2"
          variant="outline"
          size="sm"
          disabled={config.length === 0}
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
          form={form}
          fields={fields}
          onSubmit={(values) => {
            onAdd(
              values.field as F,
              values.value,
              values.condition as FilterCondition
            );
            setIsAddOpen(false);
            form.reset();
          }}
          submitButton={{
            text: "table.filter.submit",
          }}
          intlFields
        />
      </PopoverContent>
    </Popover>
  );
});

AddFilterButton.displayName = "AddFilterButton";
