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
import {
  IPaymentMethod,
  PaymentMethodIcon,
  PaymentMethodType,
} from "@/types/payment-method.types";
import {
  createRestaurantPaymentMethodMutation,
  ICreatePaymentMethod,
} from "@/api/fetch/restaurants/payment-methods/createPaymentMethod";
import { updateRestaurantPaymentMethodMutation } from "@/api/fetch/restaurants/payment-methods/updatePaymentMethod";

export type RestaurantPaymentMethodDialogProps = {
  data: {
    restaurantId: string;
    method?: IPaymentMethod | null;
  };
  open?: boolean;
  onClose?: () => void;
};

type FormValues = ICreatePaymentMethod;

const RestaurantPaymentMethodDialog = (
  props: RestaurantPaymentMethodDialogProps
) => {
  const { data, open, onClose } = props;

  const isEdit = !!data.method;
  const restaurantId = data.restaurantId;
  const methodId = data.method?.id;
  // const isYooKassa = data.method?.type === PaymentMethodType.YOO_KASSA;

  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: data.method?.name ?? "",
      type: data.method?.type ?? PaymentMethodType.CUSTOM,
      icon: data.method?.icon ?? PaymentMethodIcon.CARD,
      isActive: data.method?.isActive ?? true,
      secretId: data.method?.secretId ?? "",
      secretKey: "",
    }),
    [data.method]
  );

  const form = useForm<FormValues>({
    defaultValues,
  });

  const selectedType = form.watch("type");
  const showSecretFields = selectedType === PaymentMethodType.YOO_KASSA;

  const onSubmit = async (values: FormValues) => {
    try {
      if (!isEdit) {
        await createRestaurantPaymentMethodMutation({
          urlValues: {
            restaurantId,
          },
          data: values,
        });
        toast({
          title: t("PaymentMethods.dialog.create-success"),
          description: t("PaymentMethods.dialog.create-success-description"),
          variant: "success",
        });
      } else {
        if (!methodId) throw new Error("Payment method ID is required");

        await updateRestaurantPaymentMethodMutation({
          urlValues: {
            restaurantId,
            paymentMethodId: methodId,
          },
          data: {
            name: values.name,
            icon: values.icon,
            isActive: values.isActive,
          },
        });

        toast({
          title: t("PaymentMethods.dialog.edit-success"),
          description: t("PaymentMethods.dialog.edit-success-description"),
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
                ? "PaymentMethods.dialog.edit-title"
                : "PaymentMethods.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
        <Form<FormValues>
          form={form}
          intlFields
          fields={[
            {
              name: "name",
              label: "PaymentMethods.dialog.form.name",
              required: true,
              data: {
                type: "input",
                placeholder: "PaymentMethods.dialog.form.name-placeholder",
              },
            },
            {
              name: "type",
              label: "PaymentMethods.dialog.form.type",
              required: true,
              disabled: isEdit,
              data: {
                type: "select",
                placeholder: "PaymentMethods.dialog.form.type-placeholder",
                options: Object.values(PaymentMethodType).map((type) => ({
                  label: `PaymentMethods.types.${type}`,
                  value: type,
                })),
              },
            },
            {
              name: "icon",
              label: "PaymentMethods.dialog.form.icon",
              required: true,
              data: {
                type: "select",
                placeholder: "PaymentMethods.dialog.form.icon-placeholder",
                options: Object.values(PaymentMethodIcon).map((icon) => ({
                  label: `PaymentMethods.icons.${icon}`,
                  value: icon,
                })),
              },
            },
            {
              name: "secretId",
              label: "PaymentMethods.dialog.form.secretId",
              required: showSecretFields,
              hidden: !showSecretFields,
              disabled: isEdit,
              data: {
                type: "input",
                placeholder: "PaymentMethods.dialog.form.secretId-placeholder",
              },
            },
            {
              name: "secretKey",
              label: "PaymentMethods.dialog.form.secretKey",
              required: !isEdit && showSecretFields,
              hidden: isEdit || !showSecretFields,
              data: {
                type: "password",
                placeholder: "PaymentMethods.dialog.form.secretKey-placeholder",
              },
              description: "PaymentMethods.dialog.form.secretKey-description",
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

export default memo(RestaurantPaymentMethodDialog);
