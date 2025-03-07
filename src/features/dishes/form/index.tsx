"use client";

import { Form } from "@/components/form";
import { ICreateDish } from "@/api/fetch/dishes/createDish";
import { WeightMeasure } from "@/types/dish.types";
import { UseFormReturn } from "react-hook-form";
import { FC } from "react";
import { useGetDishesMenus } from "@/api/fetch/dishes-menus/useGetDishesMenus";

export type DishFormProps = {
  enableMenuSelect: boolean;
  form: UseFormReturn<ICreateDish>;
  onSubmit: (data: ICreateDish) => Promise<void>;
  submitText: string;
};

const DishForm: FC<DishFormProps> = (props) => {
  const { enableMenuSelect, form, onSubmit, submitText } = props;

  const menus = useGetDishesMenus({});

  return (
    <Form<ICreateDish>
      form={form}
      intlFields
      fields={[
        {
          name: "name",
          label: "fields.name",
          required: true,
          data: {
            type: "input",
            placeholder: "Dishes.dialog.form.name-placeholder",
          },
        },
        {
          name: "menuId",
          label: "fields.menu",
          required: enableMenuSelect,
          data: {
            // TODO: Make group by owner
            type: "select",
            placeholder: "Dishes.dialog.form.menu-placeholder",
            options: (menus.data ?? []).map((menu) => ({
              label: menu.name,
              value: menu.id,
              intl: false,
            })),
          },
          disabled: !enableMenuSelect,
        },
        {
          name: "note",
          label: "fields.note",
          data: {
            type: "textarea",
            placeholder: "Dishes.dialog.form.note-placeholder",
          },
        },
        {
          className: "col-span-6",
          name: "cookingTimeInMin",
          label: "fields.cookingTimeInMin",
          required: true,
          data: {
            type: "number",
            placeholder: "Dishes.dialog.form.cookingTimeInMin-placeholder",
          },
        },
        {
          className: "col-span-6",
          name: "amountPerItem",
          label: "fields.amountPerItem",
          required: true,
          data: {
            type: "number",
            placeholder: "Dishes.dialog.form.amountPerItem-placeholder",
          },
        },
        {
          className: "col-span-6",
          name: "weight",
          label: "fields.weight",
          required: true,
          data: {
            type: "number",
            placeholder: "Dishes.dialog.form.weight-placeholder",
          },
        },
        {
          className: "col-span-6",
          name: "weightMeasure",
          label: "fields.weightMeasure",
          required: true,
          data: {
            type: "select",
            options: Object.values(WeightMeasure).map((measure) => ({
              label: `fields.weightMeasureEnum.${measure}`,
              value: measure,
            })),
          },
        },
        {
          className: "col-span-8",
          name: "printLabelEveryItem",
          label: "fields.printLabelEveryItem",
          data: {
            type: "number",
            placeholder: "Dishes.dialog.form.printLabelEveryItem-placeholder",
          },
        },
        {
          className: "col-span-4",
          name: "isLabelPrintingEnabled",
          label: "fields.isLabelPrintingEnabled",
          data: {
            type: "switch",
          },
        },
        {
          className: "col-span-6",
          name: "isPublishedInApp",
          label: "fields.isPublishedInApp",
          data: {
            type: "switch",
          },
        },
        {
          className: "col-span-6",
          name: "isPublishedAtSite",
          label: "fields.isPublishedAtSite",
          data: {
            type: "switch",
          },
        },
      ]}
      onSubmit={onSubmit}
      submitButton={{
        text: submitText,
      }}
    />
  );
};

export default DishForm;
