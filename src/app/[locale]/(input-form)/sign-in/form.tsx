"use client";

import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { MessageCategories } from "@/messages/index.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { isAxiosError } from "axios";
import { getErrorCode } from "@/utils/getErrorCode";
import { useRouter } from "@/navigation";
import { useSession } from "@/features/guards/hooks/useSession";
import { PasswordInput } from "@/components/password-input";
import { signInMutation } from "@/features/guards/api/mutate/signIn";

export const signInSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(6),
});

export const SignInForm: FC = () => {
  const t = useTranslations(MessageCategories.FIELDS);
  const errT = useTranslations(MessageCategories.ERRORS);

  const { status, mutate } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    const { login, password } = values;

    try {
      await signInMutation({
        data: {
          login,
          password,
        },
      });

      mutate();
    } catch (err) {
      if (isAxiosError(err)) {
        const code = getErrorCode(err);

        form.setError("password", {
          message: code ? errT(code) : err?.response?.data.message,
        });

        console.error(err);

        return;
      }

      form.setError("password", {
        message: errT("unknown"),
      });
    }
  };

  useEffect(() => {
    if (status !== "authenticated") return;

    router.push("/dashboard");
  }, [status, router]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={t("login")} required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  placeholder={t("password")}
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
};
