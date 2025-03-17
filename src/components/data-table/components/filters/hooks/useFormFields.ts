import { useMemo } from "react";
import { FilterCondition } from "../index.types";
import { DataTableFiltersProps } from "..";
import { FormField } from "@/components/form/types";

export type FilterValues<F extends string = string> = {
  field: F;
  condition: FilterCondition;
  value: string;
};

type Options<F extends string> = Pick<DataTableFiltersProps<F>, "config"> & {
  selectedField?: F;
};

export const useGetFilterFormFields = <F extends string>(
  options: Options<F>
) => {
  const { selectedField, config } = options;

  const field = useMemo(
    () => config?.find((filter) => filter.field === selectedField),
    [config, selectedField]
  );

  const valueField = useMemo(() => {
    let selector: FormField<FilterValues<F>> | null = null;

    if (field?.data.type === "select") {
      selector = {
        name: "value",
        label: "table.filter.value",
        intl: true,
        required: true,
        data: {
          type: "select",
          placeholder: "table.filter.value-placeholder-select",
          options: field.data.options.map(
            ({ translatePath: label, value }) => ({
              value,
              label,
            })
          ),
        },
      };
    }

    if (field?.data.type === "input") {
      selector = {
        name: "value",
        label: "table.filter.value",
        intl: true,
        required: true,
        data: {
          type: "input",
          placeholder: "table.filter.value-placeholder",
        },
      };
    }

    if (!field && !selector) {
      selector = {
        name: "value",
        label: "table.filter.value",
        intl: true,
        disabled: true,
        data: {
          type: "input",
          placeholder: "table.filter.value-placeholder",
        },
      };
    }

    return selector;
  }, [field]);

  return useMemo(() => {
    const fields: FormField<FilterValues<F>>[] = [
      {
        // @ts-ignore
        name: "field",
        label: "table.filter.field",
        intl: true,
        required: true,
        data: {
          type: "select",
          options: config.map((filter) => ({
            value: filter.field,
            label: filter.label,
          })),
        },
      },
      {
        name: "condition",
        label: "table.filter.condition",
        intl: true,
        required: true,
        disabled: !field,
        data: {
          type: "select",
          options: (field?.conditions || Object.values(FilterCondition)).map(
            (condition) => ({
              value: condition,
              label: `table.filter.conditions.${condition}`,
            })
          ),
        },
      },
      ...(valueField ? [valueField] : []),
    ];

    return fields;
  }, [config, field, valueField]);
};
