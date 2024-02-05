"use client";

import { UserRole } from "@/api/fetch/useAuthedUser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { FC, ReactNode } from "react";
import { useForm } from "react-hook-form";
import {
  CreateWorkerPayload,
  createWorkerMutation,
} from "../../api/createWorker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/password-input";
import { isAxiosError } from "axios";
import { FieldError } from "@/api/types";
import { getErrorCode } from "@/utils/getErrorCode";
import { Loader2Icon } from "lucide-react";

export type WorkerDialogProps = {
  open?: boolean;
  onClose?: () => void;
  trigger?: ReactNode;
};

export const WorkerDialog: FC<WorkerDialogProps> = (props) => {
  const { open, onClose, trigger } = props;

  const isEdit = false;
  const t = useTranslations();

  const form = useForm<CreateWorkerPayload>({
    defaultValues: {
      login: "",
      name: "",
      password: "",
      restaurantId: null,
      role: UserRole.COURIER,
    },
  });

  const onSubmit = async (payload: CreateWorkerPayload) => {
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
          console.log("🚀 ~ onSubmit ~ contraints:", constraints);
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex w-full flex-col gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.name")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Alexander F." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.login")} *</FormLabel>
                    <FormControl>
                      <Input placeholder="robinson" {...field} required />
                    </FormControl>
                    <FormDescription>
                      {t("Workers.dialog.form.login-description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.role")} *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(UserRole).map((role) => (
                          <SelectItem key={role} value={role}>
                            {t(`roles.${role}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEdit && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.password")} *</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} required />
                      </FormControl>
                      <FormDescription>
                        {t("Workers.dialog.form.password-description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
              )}
              <Button
                className="mt-4 w-full"
                variant="default"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("Workers.dialog.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
