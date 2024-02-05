"use client";

import {
  Form as UiForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FieldValues,
  Path,
  UseFormProps,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTranslations } from "next-intl";
import { Button, ButtonProps } from "../ui/button";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { PasswordInput } from "../password-input";

export type PasswordInputFormField = {
  type: "password";
  placeholder?: string;
};

export type InputFormField = {
  type: "input";
  placeholder?: string;
};

export type SelectFormField = {
  type: "select";
  placeholder?: string;
  options: { label: string; value: string }[];
};

export type FormField<TFieldValues> = {
  name: Path<TFieldValues>;
  data: InputFormField | SelectFormField | PasswordInputFormField;
  label?: string;
  description?: string;
  intl?: boolean;
  disabled?: boolean;
  hidden?: boolean;
};

export type FormProps<TFieldValues extends FieldValues = FieldValues> = {
  className?: string;
  config?: UseFormProps<TFieldValues>;
  fields: FormField<TFieldValues>[];
  onSubmit: (values: TFieldValues, form: UseFormReturn<TFieldValues>) => void;
  submitButton: Omit<ButtonProps, "children" | "type"> & {
    text: string;
  };
  intlFields?: boolean;
};

export const Form = <TFieldValues extends FieldValues = FieldValues>(
  props: FormProps<TFieldValues>
) => {
  const {
    className,
    config,
    fields,
    onSubmit,
    submitButton,
    intlFields = false,
  } = props;

  const t = useTranslations();
  const form = useForm(config);

  // Desctructuring form object
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = form;

  // Helper function to translate text if needed
  const text = (text: string | undefined | null, intl: boolean) => {
    if (!text) return undefined;
    return intl ? t(text) : text;
  };

  // Proxy submit function to pass form object
  const proxySubmit = (values: TFieldValues) => {
    onSubmit(values, form);
  };

  return (
    // Shadcn/ui wrapper
    <UiForm {...form}>
      <form
        className={cn("flex w-full flex-col gap-2", className)}
        onSubmit={handleSubmit(proxySubmit)}
      >
        {fields
          .filter(({ hidden }) => !hidden)
          .map(
            ({
              name,
              label,
              description,
              data,
              disabled,
              intl = intlFields,
            }) => (
              <FormField
                control={control}
                name={name}
                disabled={disabled}
                render={({ field }) => (
                  <FormItem>
                    {label && <FormLabel>{text(label, intl)}</FormLabel>}

                    {/* Rendering default input */}
                    {data.type === "input" && (
                      <FormControl>
                        <Input
                          placeholder={text(data.placeholder, intl)}
                          {...field}
                        />
                      </FormControl>
                    )}

                    {/* Rendering password input */}
                    {data.type === "password" && (
                      <FormControl>
                        <PasswordInput
                          placeholder={text(data.placeholder, intl)}
                          {...field}
                        />
                      </FormControl>
                    )}

                    {/* Rendering select */}
                    {data.type === "select" && (
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={text(data.placeholder, intl)}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.options.map((option) => (
                            <SelectItem
                              value={option.value}
                              key={JSON.stringify(option)}
                            >
                              {text(option.label, intl)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {description && (
                      <FormDescription>
                        {text(description, intl)}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
                key={String(name)}
              />
            )
          )}

        {/* Show root error message if present */}
        {errors.root && <FormMessage>{errors.root.message}</FormMessage>}

        <Button
          variant="default"
          {...submitButton}
          type="submit"
          className={cn("mt-4 w-full", submitButton.className)}
          disabled={isSubmitting || isSubmitSuccessful || submitButton.disabled}
        >
          {isSubmitting && (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isSubmitSuccessful && <CheckCircle2Icon className="mr-2 h-4 w-4" />}
          <span>{submitButton.text ? t(submitButton.text) : "MISSING"}</span>
        </Button>
      </form>
    </UiForm>
  );
};

export default Form;
