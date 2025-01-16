"use client";

import { FC, useCallback, useEffect } from "react";
import { useRouter } from "@/navigation";
import { useSession } from "@/features/guards/hooks/useSession";
import {
  SignInPayload,
  signInMutation,
} from "@/features/guards/api/mutate/signIn";
import Form, { FormInstance } from "@/components/form";
import { useForm } from "react-hook-form";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export const SignInForm: FC = () => {
  const { status, mutate } = useSession();
  const router = useRouter();
  const handleError = useErrorHandler();

  const form = useForm<SignInPayload>({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: SignInPayload, form: FormInstance<SignInPayload>) => {
      try {
        await signInMutation({
          data,
        });

        mutate();
      } catch (error) {
        handleError({
          error,
          form,
        });
      }
    },
    [handleError, mutate]
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    router.push("/dashboard");
  }, [status, router]);

  return (
    <Form
      form={form}
      intlFields
      fields={[
        {
          name: "login",
          data: {
            type: "input",
            placeholder: "fields.login",
          },
        },
        {
          name: "password",
          data: {
            type: "password",
            placeholder: "fields.password",
          },
        },
      ]}
      onSubmit={onSubmit}
      submitButton={{
        text: "fields.submit",
      }}
    />
  );
};
