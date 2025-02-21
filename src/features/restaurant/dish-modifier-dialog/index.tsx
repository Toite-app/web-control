import { memo, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useToast } from "@/hooks/use-toast";
import { IDishModifier } from "@/types/dish-modifier.types";
import {
  createRestaurantDishModifierMutation,
  ICreateDishModifier,
} from "@/api/fetch/restaurants/dish-modifiers/createDishModifier";
import { updateRestaurantDishModifierMutation } from "@/api/fetch/restaurants/dish-modifiers/updateDishModifier";

export type RestaurantDishModifierDialogProps = {
  data: {
    restaurantId: string;
    modifier?: IDishModifier | null;
  };
  open?: boolean;
  onClose?: () => void;
};

type FormValues = ICreateDishModifier;

const RestaurantDishModifierDialog = (
  props: RestaurantDishModifierDialogProps
) => {
  const { data, open, onClose } = props;

  const isEdit = !!data.modifier;
  const restaurantId = data.restaurantId;
  const modifierId = data.modifier?.id;

  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: data.modifier?.name ?? "",
      isActive: data.modifier?.isActive ?? true,
    }),
    [data.modifier]
  );

  const form = useForm<FormValues>({
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!isEdit) {
        await createRestaurantDishModifierMutation({
          urlValues: {
            restaurantId,
          },
          data: values,
        });
        toast({
          title: t("DishModifiers.dialog.create-success"),
          description: t("DishModifiers.dialog.create-success-description"),
          variant: "success",
        });
      } else {
        if (!modifierId) throw new Error("Dish modifier ID is required");

        await updateRestaurantDishModifierMutation({
          urlValues: {
            restaurantId,
            dishModifierId: modifierId,
          },
          data: values,
        });

        toast({
          title: t("DishModifiers.dialog.edit-success"),
          description: t("DishModifiers.dialog.edit-success-description"),
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
      form.reset(defaultValues);
    }
  }, [open, form, defaultValues]);

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
              isEdit
                ? "DishModifiers.dialog.edit-title"
                : "DishModifiers.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
        <Form<FormValues>
          form={form}
          intlFields
          fields={[
            {
              name: "name",
              label: "DishModifiers.dialog.form.name",
              required: true,
              data: {
                type: "input",
                placeholder: "DishModifiers.dialog.form.name-placeholder",
              },
            },
            {
              name: "isActive",
              label: "fields.isEnabled",
              data: {
                type: "switch",
              },
            },
          ]}
          onSubmit={onSubmit}
          submitButton={{
            text: "Restaurants.dialog.submit",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(RestaurantDishModifierDialog);
