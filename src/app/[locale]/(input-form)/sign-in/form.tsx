"use client";

import { FC, useEffect } from "react";
import { useTranslations } from "next-intl";
import { MessageCategories } from "@/messages/index.types";
import { isAxiosError } from "axios";
import { getErrorCode } from "@/utils/getErrorCode";
import { useRouter } from "@/navigation";
import { useSession } from "@/features/guards/hooks/useSession";
import {
  SignInPayload,
  signInMutation,
} from "@/features/guards/api/mutate/signIn";
import Form, { FormInstance } from "@/components/form";

export const SignInForm: FC = () => {
  const errT = useTranslations(MessageCategories.ERRORS);

  const { status, mutate } = useSession();
  const router = useRouter();

  const onSubmit = async (
    data: SignInPayload,
    form: FormInstance<SignInPayload>
  ) => {
    try {
      await signInMutation({
        data,
      });

      mutate();
    } catch (err) {
      if (isAxiosError(err)) {
        const code = getErrorCode(err);

        form.setError("root", {
          message: code ? errT(code) : err?.response?.data.message,
        });

        console.error(err);

        return;
      }

      form.setError("root", {
        message: errT("unknown"),
      });
    }
  };

  useEffect(() => {
    if (status !== "authenticated") return;

    router.push("/dashboard");
  }, [status, router]);

  return (
    <Form
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
