"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FC, memo, useEffect } from "react";
import {
  ICreateGuest,
  createGuestMutation,
} from "@/api/fetch/guests/createGuest";
import { Form } from "@/components/form";
import { IGuest } from "@/types/guest.types";
import { putGuestMutation } from "@/api/fetch/guests/putGuest";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

export type GuestDialogProps = {
  data?: IGuest;
  open?: boolean;
  onClose?: () => void;
};

const GuestDialog: FC<GuestDialogProps> = (props) => {
  const { data: guest, open, onClose } = props;

  const isEdit = !!guest;

  const { toast } = useToast();
  const t = useTranslations();
  const handleError = useErrorHandler();

  const form = useForm<ICreateGuest>({
    defaultValues: {
      name: guest?.name || "",
      phone: guest?.phone || "",
      email: guest?.email || "",
      bonusBalance: guest?.bonusBalance || 0,
      password: "",
    },
  });

  const onSubmit = async (data: ICreateGuest) => {
    try {
      if (!isEdit) {
        await createGuestMutation({ data });
        toast({
          title: t("Guests.dialog.create-success"),
          description: t("Guests.dialog.create-success-description"),
          variant: "success",
        });
      } else {
        await putGuestMutation({
          urlValues: {
            guestId: guest.id,
          },
          data,
        });
        toast({
          title: t("Guests.dialog.edit-success"),
          description: t("Guests.dialog.edit-success-description"),
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
        name: guest?.name || "",
        phone: guest?.phone || "",
        email: guest?.email || "",
        bonusBalance: guest?.bonusBalance || 0,
        password: "",
      });
    }
  }, [open, guest, form]);

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
              isEdit ? "Guests.dialog.edit-title" : "Guests.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
        <Form<ICreateGuest>
          form={form}
          intlFields
          fields={[
            {
              name: "name",
              label: "fields.name",
              required: true,
              data: {
                type: "input",
                placeholder: "Guests.dialog.form.name-placeholder",
              },
              autoComplete: "off",
            },
            {
              name: "phone",
              label: "fields.phone",
              required: true,
              data: {
                type: "input",
                placeholder: "Guests.dialog.form.phone-placeholder",
              },
              autoComplete: "off",
            },
            {
              name: "email",
              label: "fields.email",
              data: {
                type: "input",
                placeholder: "Guests.dialog.form.email-placeholder",
              },
              autoComplete: "off",
            },
            {
              name: "bonusBalance",
              label: "fields.bonusBalance",
              required: true,
              data: {
                type: "number",
                placeholder: "Guests.dialog.form.bonus-placeholder",
              },
            },
            {
              name: "password",
              label: "fields.password",
              required: !isEdit,
              hidden: isEdit,
              data: { type: "password" },
              description: "Guests.dialog.form.password-description",
            },
          ]}
          onSubmit={onSubmit}
          submitButton={{
            text: "Guests.dialog.submit",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(GuestDialog);
