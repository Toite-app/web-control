"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FC, memo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import { Form } from "@/components/form";
import { IDish, WeightMeasure } from "@/types/dish.types";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useForm } from "react-hook-form";
import { ICreateDish, createDishMutation } from "@/api/fetch/dishes/createDish";
import { putDishMutation } from "@/api/fetch/dishes/putDish";

export type DishDialogProps = {
  data?: IDish | null;
  open?: boolean;
  onClose?: () => void;
};

const DishDialog: FC<DishDialogProps> = (props) => {
  const { data: dish, open, onClose } = props;

  const isEdit = !!dish;
  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const form = useForm<ICreateDish>({
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
    },
  });

  const onSubmit = async (data: ICreateDish) => {
    try {
      if (!isEdit) {
        await createDishMutation({ data });
        toast({
          title: t("Dishes.dialog.create-success"),
          description: t("Dishes.dialog.create-success-description"),
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
          title: t("Dishes.dialog.edit-success"),
          description: t("Dishes.dialog.edit-success-description"),
          variant: "success",
        });
      }

      onClose?.();
    } catch (error) {
      handleError({ error, form });
    }
  };

  useEffect(() => {
    if (open) {
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
      });
    }
  }, [open, dish, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && onClose) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {t(
              isEdit ? "Dishes.dialog.edit-title" : "Dishes.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
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
              name: "note",
              label: "fields.note",
              data: {
                type: "textarea",
                placeholder: "Dishes.dialog.form.note-placeholder",
              },
            },
            {
              name: "cookingTimeInMin",
              label: "fields.cookingTimeInMin",
              required: true,
              data: {
                type: "number",
                placeholder: "Dishes.dialog.form.cookingTimeInMin-placeholder",
              },
            },
            {
              name: "amountPerItem",
              label: "fields.amountPerItem",
              required: true,
              data: {
                type: "number",
                placeholder: "Dishes.dialog.form.amountPerItem-placeholder",
              },
            },
            {
              name: "weight",
              label: "fields.weight",
              required: true,
              data: {
                type: "number",
                placeholder: "Dishes.dialog.form.weight-placeholder",
              },
            },
            {
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
              name: "isLabelPrintingEnabled",
              label: "fields.isLabelPrintingEnabled",
              data: {
                type: "switch",
              },
            },
            {
              name: "printLabelEveryItem",
              label: "fields.printLabelEveryItem",
              data: {
                type: "number",
                placeholder:
                  "Dishes.dialog.form.printLabelEveryItem-placeholder",
              },
            },
            {
              name: "isPublishedInApp",
              label: "fields.isPublishedInApp",
              data: {
                type: "switch",
              },
            },
            {
              name: "isPublishedAtSite",
              label: "fields.isPublishedAtSite",
              data: {
                type: "switch",
              },
            },
          ]}
          onSubmit={onSubmit}
          submitButton={{
            text: "Dishes.dialog.submit",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(DishDialog);
