import { memo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Form } from "@/components/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { WorkshiftPaymentCategoryType } from "@/types/restaurant.types";
import { createRestaurantWorkshiftPaymentCategoryMutation } from "@/api/fetch/restaurants/workshift-payment-categories/createPaymentCategory";

export type WorkshiftPaymentCategoryDialogProps = {
  data: {
    restaurantId: string;
    parentId?: string;
    type: WorkshiftPaymentCategoryType;
  };
  open?: boolean;
  onClose?: () => void;
};

type FormValues = {
  name: string;
  description: string;
};

const WorkshiftPaymentCategoryDialog = (
  props: WorkshiftPaymentCategoryDialogProps
) => {
  const { data, open, onClose } = props;
  const { restaurantId, parentId, type } = data;

  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createRestaurantWorkshiftPaymentCategoryMutation({
        urlValues: {
          restaurantId,
        },
        data: {
          ...values,
          parentId,
          type,
        },
      });

      toast({
        title: t("PaymentCategories.dialog.create-success"),
        description: t("PaymentCategories.dialog.create-success-description"),
        variant: "success",
      });

      onClose?.();
    } catch (error) {
      handleError({ error, form });
    }
  };

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [open, form]);

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
            {t("PaymentCategories.dialog.create-title")}
          </DialogTitle>
        </DialogHeader>
        <Form<FormValues>
          form={form}
          intlFields
          fields={[
            {
              name: "name",
              label: "fields.name",
              required: true,
              data: {
                type: "input",
                placeholder: "PaymentCategories.dialog.form.name-placeholder",
              },
            },
            {
              name: "description",
              label: "fields.note",
              data: {
                type: "textarea",
                placeholder:
                  "PaymentCategories.dialog.form.description-placeholder",
              },
            },
          ]}
          onSubmit={onSubmit}
          submitButton={{
            text: "PaymentCategories.dialog.submit",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(WorkshiftPaymentCategoryDialog);
