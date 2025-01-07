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
  ICreateRestaurantHour,
  createRestaurantHourMutation,
} from "@/features/restaurant/api/createRestaurantHour";
import { useForm } from "react-hook-form";
import { DayOfWeekEnum } from "@/types/general.types";
import { IRestaurantHour } from "@/types/restaurant.types";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useToast } from "@/hooks/use-toast";
import { putRestaurantHourMutation } from "@/features/restaurant/api/putRestaurantHour";

export type RestaurantHourDialogProps = {
  data: {
    restaurantId: string;
    hour?: IRestaurantHour | null;
    disabledDays?: DayOfWeekEnum[];
  };
  open?: boolean;
  onClose?: () => void;
};

const RestaurantHourDialog = (props: RestaurantHourDialogProps) => {
  const { data, open, onClose } = props;

  const isEdit = !!data.hour;
  const restaurantId = data.restaurantId;
  const hourId = data.hour?.id;

  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const defaultValues = useMemo(() => {
    const availableDays = Object.values(DayOfWeekEnum).filter(
      (day) => !data.disabledDays?.includes(day)
    );

    const defaultDay = data.hour?.dayOfWeek ?? availableDays?.[0] ?? "monday";

    return {
      dayOfWeek: defaultDay,
      openingTime: data.hour?.openingTime ?? "00:00",
      closingTime: data.hour?.closingTime ?? "00:00",
      isEnabled: data.hour?.isEnabled ?? true,
    };
  }, [data]);

  const form = useForm<ICreateRestaurantHour>({
    defaultValues,
  });

  const onSubmit = async (data: ICreateRestaurantHour) => {
    try {
      if (!isEdit) {
        await createRestaurantHourMutation({
          urlValues: {
            restaurantId,
          },
          data,
        });
        toast({
          title: t("RestaurantHours.dialog.create-success"),
          description: t("RestaurantHours.dialog.create-success-description"),
          variant: "success",
        });
      } else {
        if (!hourId) throw new Error("Hour ID is required");

        await putRestaurantHourMutation({
          urlValues: {
            restaurantId,
            hourId,
          },
          data,
        });

        toast({
          title: t("RestaurantHours.dialog.edit-success"),
          description: t("RestaurantHours.dialog.edit-success-description"),
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
                ? "RestaurantHours.dialog.edit-title"
                : "RestaurantHours.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
        <Form<ICreateRestaurantHour>
          form={form}
          intlFields
          fields={[
            {
              name: "dayOfWeek",
              label: "fields.dayOfWeek",
              required: true,
              intl: true,
              data: {
                type: "select",
                placeholder:
                  "RestaurantHours.dialog.form.dayOfWeek-placeholder",
                options: Object.values(DayOfWeekEnum).map((day) => ({
                  label: `dayOfWeek.${day}`,
                  value: day,
                  disabled: data.disabledDays?.includes(day),
                })),
              },
            },
            {
              name: "openingTime",
              label: "RestaurantHours.form.openingTime-label",
              required: true,
              intl: true,
              data: {
                type: "time-select",
              },
            },
            {
              name: "closingTime",
              label: "RestaurantHours.form.closingTime-label",
              required: true,
              data: {
                type: "time-select",
              },
            },
            {
              name: "isEnabled",
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

export default memo(RestaurantHourDialog);
