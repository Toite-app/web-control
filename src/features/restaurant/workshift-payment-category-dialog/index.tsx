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
import {
  IWorkshiftPaymentCategory,
  WorkshiftPaymentCategoryType,
} from "@/types/restaurant.types";
import { createRestaurantWorkshiftPaymentCategoryMutation } from "@/api/fetch/restaurants/workshift-payment-categories/createPaymentCategory";
import { updateRestaurantWorkshiftPaymentCategoryMutation } from "@/api/fetch/restaurants/workshift-payment-categories/updatePaymentCategory";

export type WorkshiftPaymentCategoryDialogProps = {
  data: {
    restaurantId: string;
    parentId?: string;
    type: WorkshiftPaymentCategoryType;
    category?: IWorkshiftPaymentCategory;
  };
  open?: boolean;
  onClose?: () => void;
};

type FormValues = {
  name: string;
  description: string;
  isActive: boolean;
};

const WorkshiftPaymentCategoryDialog = (
  props: WorkshiftPaymentCategoryDialogProps
) => {
  const { data, open, onClose } = props;
  const { restaurantId, parentId, type, category } = data;

  const isEdit = !!category;

  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!isEdit) {
        await createRestaurantWorkshiftPaymentCategoryMutation({
          urlValues: {
            restaurantId,
          },
          data: {
            name: values.name,
            description: values.description,
            parentId,
            type,
          },
        });
      } else {
        await updateRestaurantWorkshiftPaymentCategoryMutation({
          urlValues: {
            restaurantId,
            categoryId: category.id,
          },
          data: {
            name: values.name,
            description: values.description,
            isActive: values.isActive,
          },
        });
      }

      toast({
        title: t(
          isEdit
            ? "PaymentCategories.dialog.edit-success"
            : "PaymentCategories.dialog.create-success"
        ),
        description: t(
          isEdit
            ? "PaymentCategories.dialog.edit-success-description"
            : "PaymentCategories.dialog.create-success-description"
        ),
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
        name: category?.name ?? "",
        description: category?.description ?? "",
        isActive: category?.isActive ?? true,
      });
    }
  }, [open, category, form]);

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
                ? "PaymentCategories.dialog.edit-title"
                : "PaymentCategories.dialog.create-title"
            )}
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
            {
              name: "isActive",
              label: "fields.isEnabled",
              hidden: !isEdit,
              data: {
                type: "switch",
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
