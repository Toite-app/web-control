import { memo, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/form";
import { useTranslations } from "next-intl";
import {
  ICreateRestaurantWorkshop,
  createRestaurantWorkshopMutation,
} from "@/features/restaurant/api/createRestaurantWorkshop";
import { useForm } from "react-hook-form";
import { IRestaurantWorkshop } from "@/types/restaurant.types";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useToast } from "@/hooks/use-toast";
import { putRestaurantWorkshopMutation } from "@/features/restaurant/api/putRestaurantWorkshop";

export type RestaurantWorkshopDialogProps = {
  data: {
    restaurantId: string;
    workshop?: IRestaurantWorkshop | null;
  };
  open?: boolean;
  onClose?: () => void;
};

const RestaurantWorkshopDialog = (props: RestaurantWorkshopDialogProps) => {
  const { data, open, onClose } = props;

  const isEdit = !!data.workshop;
  const restaurantId = data.restaurantId;
  const workshopId = data.workshop?.id;

  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const defaultValues = useMemo(() => {
    return {
      name: data.workshop?.name ?? "",
      isLabelPrintingEnabled: data.workshop?.isLabelPrintingEnabled ?? false,
      isEnabled: data.workshop?.isEnabled ?? true,
    };
  }, [data]);

  const form = useForm<ICreateRestaurantWorkshop>({
    defaultValues,
  });

  const onSubmit = async (data: ICreateRestaurantWorkshop) => {
    try {
      if (!isEdit) {
        await createRestaurantWorkshopMutation({
          urlValues: {
            restaurantId,
          },
          data,
        });
        toast({
          title: t("RestaurantWorkshops.dialog.create-success"),
          description: t(
            "RestaurantWorkshops.dialog.create-success-description"
          ),
          variant: "success",
        });
      } else {
        if (!workshopId) throw new Error("Workshop ID is required");

        await putRestaurantWorkshopMutation({
          urlValues: {
            restaurantId,
            workshopId,
          },
          data,
        });

        toast({
          title: t("RestaurantWorkshops.dialog.edit-success"),
          description: t("RestaurantWorkshops.dialog.edit-success-description"),
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
                ? "RestaurantWorkshops.dialog.edit-title"
                : "RestaurantWorkshops.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
        <Form<ICreateRestaurantWorkshop>
          form={form}
          intlFields
          fields={[
            {
              name: "name",
              label: "RestaurantWorkshops.dialog.form.name-label",
              required: true,
              data: {
                type: "input",
                placeholder: "RestaurantWorkshops.dialog.form.name-placeholder",
              },
            },
            {
              name: "isLabelPrintingEnabled",
              label:
                "RestaurantWorkshops.dialog.form.isLabelPrintingEnabled-label",
              data: {
                type: "switch",
              },
            },
            {
              name: "isEnabled",
              label: "RestaurantWorkshops.dialog.form.isEnabled-label",
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

export default memo(RestaurantWorkshopDialog);
