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
import { IRestaurant } from "@/types/restaurant.types";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useForm } from "react-hook-form";
import {
  ICreateRestaurant,
  createRestaurantMutation,
} from "../../api/createRestaurant";
import { putRestaurantMutation } from "../../api/putRestaurant";
import { useGetTimezones } from "@/api/fetch/useGetTimezones";
import { useAuth } from "@/features/guards/api/useAuth";
import { IWorker, WorkerRole } from "@/types/worker.types";
import { useGetWorkers } from "@/features/workers/api/useGetWorkers";
import { buildFiltersParam } from "@/lib/filters";

export type RestaurantDialogProps = {
  data?: IRestaurant | null;
  open?: boolean;
  onClose?: () => void;
};

const RestaurantDialog: FC<RestaurantDialogProps> = (props) => {
  const { data: restaurant, open, onClose } = props;

  const isEdit = !!restaurant;
  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const user = useAuth();
  const timezones = useGetTimezones({
    skip: !open,
  });

  const canAssignOwner =
    user.data?.role &&
    (user.data.role === WorkerRole.SYSTEM_ADMIN ||
      user.data.role === WorkerRole.CHIEF_ADMIN);

  const owners = useGetWorkers({
    params: {
      size: 100,
      filters: buildFiltersParam<IWorker>([
        {
          field: "role",
          condition: "equals",
          value: "OWNER",
        },
      ]),
    },
    skip: !open && canAssignOwner,
  });

  const form = useForm<ICreateRestaurant>({
    defaultValues: {
      name: restaurant?.name ?? "",
      legalEntity: restaurant?.legalEntity ?? "",
      address: restaurant?.address ?? "",
      timezone: restaurant?.timezone ?? "",
      latitude: restaurant?.latitude ?? 0,
      longitude: restaurant?.longitude ?? 0,
      currency: restaurant?.currency,
      isEnabled: restaurant?.isEnabled ?? true,
      isClosedForever: restaurant?.isClosedForever ?? false,
      ownerId: canAssignOwner ? restaurant?.ownerId ?? null : null,
    },
  });

  const onSubmit = async (data: ICreateRestaurant) => {
    try {
      if (!isEdit) {
        await createRestaurantMutation({ data });
        toast({
          title: t("Restaurants.dialog.create-success"),
          description: t("Restaurants.dialog.create-success-description"),
          variant: "success",
        });
      } else {
        await putRestaurantMutation({
          urlValues: {
            id: restaurant.id,
          },
          data,
        });
        toast({
          title: t("Restaurants.dialog.edit-success"),
          description: t("Restaurants.dialog.edit-success-description"),
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
        name: restaurant?.name ?? "",
        legalEntity: restaurant?.legalEntity ?? "",
        address: restaurant?.address ?? "",
        latitude: restaurant?.latitude ?? 0,
        longitude: restaurant?.longitude ?? 0,
        timezone: restaurant?.timezone ?? "",
        currency: restaurant?.currency,
        isEnabled: restaurant?.isEnabled ?? true,
        isClosedForever: restaurant?.isClosedForever ?? false,
        ownerId: canAssignOwner ? restaurant?.ownerId ?? null : null,
      });
    }
  }, [open, restaurant, form, canAssignOwner]);

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
                ? "Restaurants.dialog.edit-title"
                : "Restaurants.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
        <Form<ICreateRestaurant>
          form={form}
          intlFields
          fields={[
            {
              name: "name",
              label: "fields.name",
              required: true,
              data: {
                type: "input",
                placeholder: "Restaurants.dialog.form.name-placeholder",
              },
            },
            {
              name: "legalEntity",
              label: "fields.legalEntity",
              required: true,
              data: {
                type: "input",
                placeholder: "Restaurants.dialog.form.legalEntity-placeholder",
              },
            },
            {
              name: "address",
              label: "fields.address",
              required: true,
              data: {
                type: "address-suggestion",
                placeholder: "Restaurants.dialog.form.address-placeholder",
              },
            },
            {
              name: "currency",
              label: "fields.currency",
              required: true,
              disabled: isEdit,
              data: {
                type: "select",
                placeholder: "Restaurants.dialog.form.currency-placeholder",
                options: ["EUR", "USD", "RUB"].map((currency) => ({
                  label: `currency.${currency}`,
                  value: currency,
                  intl: true,
                })),
              },
            },
            {
              name: "latitude",
              label: "fields.latitude",
              required: true,
              data: {
                type: "number",
                placeholder: "Restaurants.dialog.form.latitude-placeholder",
              },
            },
            {
              name: "longitude",
              label: "fields.longitude",
              required: true,
              data: {
                type: "number",
                placeholder: "Restaurants.dialog.form.longitude-placeholder",
              },
            },
            {
              name: "timezone",
              label: "fields.timezone",
              required: true,
              data: {
                type: "select",
                placeholder: "Restaurants.dialog.form.timezone-placeholder",
                options: (timezones.data?.timezones || []).map((tzName) => ({
                  label: tzName,
                  value: tzName,
                  intl: false,
                })),
              },
            },
            {
              name: "ownerId",
              label: "fields.owner",
              hidden: !canAssignOwner,
              data: {
                type: "select",
                placeholder: "Restaurants.dialog.form.owner-placeholder",
                withEmptyOption: true,
                options:
                  owners.data?.data.map((worker) => ({
                    label: worker.name,
                    value: worker.id,
                    intl: false,
                  })) ?? [],
              },
            },
            {
              name: "isEnabled",
              label: "fields.isEnabled",
              data: {
                type: "switch",
              },
            },
            {
              name: "isClosedForever",
              label: "fields.isClosedForever",
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

export default memo(RestaurantDialog);
