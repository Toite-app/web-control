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
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useForm } from "react-hook-form";
import { useGetRestaurants } from "@/features/restaurants/api/useGetRestaurants";
import {
  ICreateWorkshift,
  createWorkshiftMutation,
} from "@/api/fetch/workshifts/createWorkshift";

export type OpenWorkshiftDialogProps = {
  open?: boolean;
  onClose?: () => void;
};

const OpenWorkshiftDialog: FC<OpenWorkshiftDialogProps> = (props) => {
  const { open, onClose } = props;

  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const restaurants = useGetRestaurants({
    params: {
      size: 100,
    },
    skip: !open,
  });

  const form = useForm<ICreateWorkshift>({
    defaultValues: {
      restaurantId: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        {
          restaurantId: "",
        },
        {
          keepIsSubmitSuccessful: false,
          keepIsSubmitted: false,
        }
      );
    }
  }, [open, form]);

  const onSubmit = async (data: ICreateWorkshift) => {
    try {
      await createWorkshiftMutation({ data });

      toast({
        title: t("workshifts.dialog.create-success"),
        description: t("workshifts.dialog.create-success-description"),
        variant: "success",
      });

      onClose?.();
    } catch (error) {
      handleError({ error, form });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && onClose) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("workshifts.dialog.create-title")}</DialogTitle>
        </DialogHeader>
        <Form<ICreateWorkshift>
          form={form}
          intlFields
          fields={[
            {
              name: "restaurantId",
              label: "workshifts.dialog.form.restaurant-label",
              required: true,
              data: {
                type: "select",
                placeholder: "workshifts.dialog.form.restaurant-placeholder",
                options: (restaurants.data?.data || []).map((restaurant) => ({
                  label: restaurant.name,
                  value: restaurant.id,
                  intl: false,
                })),
              },
              description: "workshifts.dialog.form.restaurant-description",
            },
          ]}
          onSubmit={onSubmit}
          submitButton={{
            text: "workshifts.dialog.submit",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(OpenWorkshiftDialog);
