"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FC, memo } from "react";
import { ICreateWorker, createWorkerMutation } from "../../api/createWorker";
import { isAxiosError } from "axios";
import { FieldError } from "@/api/types";
import { getErrorCode } from "@/utils/getErrorCode";
import Form, { FormInstance } from "@/components/form";
import { WorkerRole } from "@/types/worker.types";

export type WorkerDialogProps = {
  open?: boolean;
  onClose?: () => void;
};

const WorkerDialog: FC<WorkerDialogProps> = (props) => {
  const { open, onClose } = props;

  const isEdit = false;
  const t = useTranslations();

  const onSubmit = async (
    data: ICreateWorker,
    form: FormInstance<ICreateWorker>
  ) => {
    try {
      await createWorkerMutation({
        data,
      });

      onClose?.();
    } catch (err) {
      if (isAxiosError(err)) {
        if (typeof err.response?.data.message === "string") {
          const code = getErrorCode(err);

          form.setError("root", {
            message: t(`Workers.dialog.errors.${code}`),
          });

          return;
        }

        const errors = err.response?.data.message as FieldError<
          keyof ICreateWorker
        >[];

        for (const { property, constraints } of errors) {
          const errCode = Object.keys(constraints)?.[0] ?? "";
          const message = t(`Workers.dialog.errors.${errCode}`);

          form.setError(property, { message });
        }
      }
      console.error(err);
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
                ? "Workers.dialog.edit-title"
                : "Workers.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
        <Form
          intlFields
          fields={[
            {
              name: "name",
              label: "fields.name",
              data: {
                type: "input",
                placeholder: "Workers.dialog.form.name-placeholder",
              },
              autocomplete: "off",
            },
            {
              name: "login",
              label: "fields.login",
              required: true,
              data: {
                type: "input",
                placeholder: "Workers.dialog.form.login-placeholder",
              },
              description: "Workers.dialog.form.login-description",
              autocomplete: "off",
            },
            {
              name: "role",
              label: "fields.role",
              required: true,
              data: {
                type: "select",
                placeholder: "Workers.dialog.form.role-placeholder",
                options: Object.values(WorkerRole).map((role) => ({
                  label: `roles.${role}`,
                  value: role,
                })),
              },
            },
            {
              name: "password",
              label: "fields.password",
              required: true,
              data: { type: "password" },
              description: "Workers.dialog.form.password-description",
            },
          ]}
          defaultValues={{
            name: "",
            login: "",
            role: undefined,
            password: "",
          }}
          onSubmit={onSubmit}
          submitButton={{
            text: "Workers.dialog.submit",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(WorkerDialog);
