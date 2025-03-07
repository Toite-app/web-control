"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FC, memo, useEffect } from "react";
import { Form } from "@/components/form";
import { IDishCategory } from "@/types/dish-category.types";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  ICreateDishCategory,
  createDishCategoryMutation,
} from "@/api/fetch/dish-categories/createDishCategory";
import { putDishCategoryMutation } from "@/api/fetch/dish-categories/putDishCategory";

export type DishCategoryDialogProps = {
  data?: {
    menuId: string;
    dishCategory?: IDishCategory;
  };
  open?: boolean;
  onClose?: () => void;
};

const DishCategoryDialog: FC<DishCategoryDialogProps> = (props) => {
  const { data, open, onClose } = props;
  const { menuId, dishCategory } = data ?? {};

  const isEdit = !!dishCategory;

  const { toast } = useToast();
  const t = useTranslations();
  const handleError = useErrorHandler();

  const form = useForm<ICreateDishCategory>({
    defaultValues: {
      menuId,
      name: dishCategory?.name ?? "",
      showForWorkers: dishCategory?.showForWorkers ?? false,
      showForGuests: dishCategory?.showForGuests ?? false,
    },
  });

  const onSubmit = async (data: ICreateDishCategory) => {
    try {
      if (!isEdit) {
        await createDishCategoryMutation({ data });

        toast({
          title: t("DishCategories.dialog.create-success"),
          description: t("DishCategories.dialog.create-success-description"),
          variant: "success",
        });
      } else {
        await putDishCategoryMutation({
          urlValues: {
            categoryId: dishCategory.id,
          },
          data,
        });
        toast({
          title: t("DishCategories.dialog.edit-success"),
          description: t("DishCategories.dialog.edit-success-description"),
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
        menuId,
        name: dishCategory?.name ?? "",
        showForWorkers: dishCategory?.showForWorkers ?? false,
        showForGuests: dishCategory?.showForGuests ?? false,
      });
    }
  }, [open, dishCategory, form, menuId]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && onClose) onClose();
      }}
      modal
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {t(
              isEdit
                ? "DishCategories.dialog.edit-title"
                : "DishCategories.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
        <Form<ICreateDishCategory>
          form={form}
          intlFields
          fields={[
            {
              name: "name",
              label: "fields.name",
              required: true,
              data: {
                type: "input",
                placeholder: "DishCategories.dialog.form.name-placeholder",
              },
              autoComplete: "off",
            },
            {
              name: "showForWorkers",
              label: "fields.showForWorkers",
              data: {
                type: "switch",
              },
            },
            {
              name: "showForGuests",
              label: "fields.showForGuests",
              data: {
                type: "switch",
              },
            },
          ]}
          onSubmit={onSubmit}
          submitButton={{
            text: "DishCategories.dialog.submit",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(DishCategoryDialog);
