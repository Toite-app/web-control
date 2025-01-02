"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FC, memo } from "react";
import { Form } from "@/components/form";
import { IRestaurant } from "@/types/restaurant.types";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useForm } from "react-hook-form";
import {
  ICreateRestaurant,
  createRestaurantMutation,
} from "../../api/createRestaurant";
import { putRestaurantMutation } from "../../api/putRestaurant";

export type RestaurantDialogProps = {
  data?: IRestaurant;
  open?: boolean;
  onClose?: () => void;
};

const RestaurantDialog: FC<RestaurantDialogProps> = (props) => {
  const { data: restaurant, open, onClose } = props;

  const isEdit = !!restaurant;
  const t = useTranslations();
  const handleError = useErrorHandler();

  const form = useForm<ICreateRestaurant>({
    defaultValues: {
      name: restaurant?.name || "",
      legalEntity: restaurant?.legalEntity || "",
      address: restaurant?.address || "",
      latitude: restaurant?.latitude || 0,
      longitude: restaurant?.longitude || 0,
      isEnabled: restaurant?.isEnabled ?? true,
    },
  });

  const onSubmit = async (data: ICreateRestaurant) => {
    try {
      if (!isEdit) {
        await createRestaurantMutation({ data });
      } else {
        await putRestaurantMutation({
          urlValues: {
            id: restaurant.id,
          },
          data,
        });
      }

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
                type: "input",
                placeholder: "Restaurants.dialog.form.address-placeholder",
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

export default memo(RestaurantDialog);
