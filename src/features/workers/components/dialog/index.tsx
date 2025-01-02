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
import { Form } from "@/components/form";
import { IWorker, WorkerRole } from "@/types/worker.types";
import { putWorkerMutation } from "../../api/putWorker";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useForm } from "react-hook-form";

export type WorkerDialogProps = {
  data?: IWorker;
  open?: boolean;
  onClose?: () => void;
};

const WorkerDialog: FC<WorkerDialogProps> = (props) => {
  const { data: worker, open, onClose } = props;

  const isEdit = !!worker;
  const t = useTranslations();
  const handleError = useErrorHandler();

  const form = useForm<ICreateWorker>({
    defaultValues: {
      name: worker?.name || "",
      login: worker?.login || "",
      role: worker?.role || undefined,
      password: "",
    },
  });

  const onSubmit = async (data: ICreateWorker) => {
    try {
      if (!isEdit) {
        await createWorkerMutation({ data });
      } else {
        await putWorkerMutation({
          urlValues: {
            id: worker.id,
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
                ? "Workers.dialog.edit-title"
                : "Workers.dialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>
        <Form<ICreateWorker>
          form={form}
          intlFields
          fields={[
            {
              name: "name",
              label: "fields.name",
              data: {
                type: "input",
                placeholder: "Workers.dialog.form.name-placeholder",
              },
              autoComplete: "off",
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
              autoComplete: "off",
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
              hidden: isEdit,
              data: { type: "password" },
              description: "Workers.dialog.form.password-description",
            },
          ]}
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
