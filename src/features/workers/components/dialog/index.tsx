"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FC, ReactNode } from "react";
import {
  CreateWorkerPayload,
  createWorkerMutation,
} from "../../api/createWorker";
import { isAxiosError } from "axios";
import { FieldError } from "@/api/types";
import { getErrorCode } from "@/utils/getErrorCode";
import Form, { FormInstance } from "@/components/form";
import { WorkerRole } from "@/types/worker.types";

export type WorkerDialogProps = {
  open?: boolean;
  onClose?: () => void;
  trigger?: ReactNode;
};

export const WorkerDialog: FC<WorkerDialogProps> = (props) => {
  const { open, onClose, trigger } = props;

  const isEdit = false;
  const t = useTranslations();

  const onSubmit = async (
    payload: CreateWorkerPayload,
    form: FormInstance<CreateWorkerPayload>
  ) => {
    try {
      const result = await createWorkerMutation({
        payload,
      });
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
          keyof CreateWorkerPayload
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
    <Dialog>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}

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
          fields={[
            {
              name: "name",
              label: "fields.name",
              data: { type: "input", placeholder: "Alexander F." },
            },
            {
              name: "login",
              label: "fields.login",
              required: true,
              data: { type: "input", placeholder: "robinson" },
              description: "Workers.dialog.form.login-description",
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
          intlFields
          onSubmit={onSubmit}
          submitButton={{
            text: "Workers.dialog.submit",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
