"use client";

import { FC, memo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { IDish, WeightMeasure } from "@/types/dish.types";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useForm } from "react-hook-form";
import { ICreateDish, createDishMutation } from "@/api/fetch/dishes/createDish";
import { putDishMutation } from "@/api/fetch/dishes/putDish";
import DishForm, { DishFormValues } from "../../dishes/form";

export type DishFormTabProps = {
  data?: IDish | null;
};

const DishFormTab: FC<DishFormTabProps> = (props) => {
  const { data: dish } = props;

  const isEdit = !!dish;
  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const form = useForm<DishFormValues>({
    defaultValues: {
      name: dish?.name ?? "",
      note: dish?.note ?? "",
      cookingTimeInMin: dish?.cookingTimeInMin ?? 0,
      amountPerItem: dish?.amountPerItem ?? 1,
      weight: dish?.weight ?? 0,
      weightMeasure: dish?.weightMeasure ?? WeightMeasure.grams,
      isLabelPrintingEnabled: dish?.isLabelPrintingEnabled ?? false,
      printLabelEveryItem: dish?.printLabelEveryItem ?? 1,
      isPublishedInApp: dish?.isPublishedInApp ?? false,
      isPublishedAtSite: dish?.isPublishedAtSite ?? false,
      menuId: dish?.menuId ?? null,
      categories: dish?.categories.map((category) => ({
        label: category.name,
        value: category.id,
        intl: false,
      })),
    },
  });

  const onSubmit = async (data: ICreateDish) => {
    try {
      if (!isEdit) {
        await createDishMutation({ data });
        toast({
          title: t("Dishes.form.create-success"),
          description: t("Dishes.form.create-success-description"),
          variant: "success",
        });
      } else {
        await putDishMutation({
          urlValues: {
            dishId: dish.id,
          },
          data,
        });
        toast({
          title: t("Dishes.form.edit-success"),
          description: t("Dishes.form.edit-success-description"),
          variant: "success",
        });
      }
    } catch (error) {
      handleError({ error, form });
    }
  };

  useEffect(() => {
    form.reset({
      name: dish?.name ?? "",
      note: dish?.note ?? "",
      cookingTimeInMin: dish?.cookingTimeInMin ?? 0,
      amountPerItem: dish?.amountPerItem ?? 1,
      weight: dish?.weight ?? 0,
      weightMeasure: dish?.weightMeasure ?? WeightMeasure.grams,
      isLabelPrintingEnabled: dish?.isLabelPrintingEnabled ?? false,
      printLabelEveryItem: dish?.printLabelEveryItem ?? 1,
      isPublishedInApp: dish?.isPublishedInApp ?? false,
      isPublishedAtSite: dish?.isPublishedAtSite ?? false,
      menuId: dish?.menuId ?? null,
      categories: dish?.categories.map((category) => ({
        label: category.name,
        value: category.id,
        intl: false,
      })),
    });
  }, [dish, form]);

  return (
    <div className="p-6">
      <DishForm
        enableMenuSelect={false}
        form={form}
        onSubmit={onSubmit}
        submitText={isEdit ? "Dishes.form.save" : "Dishes.form.create"}
      />
    </div>
  );
};

export default memo(DishFormTab);
