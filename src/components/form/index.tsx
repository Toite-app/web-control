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
  DefaultValues,
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
import { useEffect } from "react";

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
  required?: boolean;
  autoComplete?: string;
};

export type FormInstance<TFieldValues extends FieldValues> =
  UseFormReturn<TFieldValues>;

export type FormProps<TFieldValues extends FieldValues = FieldValues> = {
  className?: string;
  config?: UseFormProps<TFieldValues>;
  fields: FormField<TFieldValues>[];
  defaultValues: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues, form: FormInstance<TFieldValues>) => void;
  submitButton: Omit<ButtonProps, "children" | "type"> & {
    text: string;
  };
  intlFields?: boolean;
  onFormInit?: (form: FormInstance<TFieldValues>) => void;
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
    defaultValues,
    onFormInit,
  } = props;

  const t = useTranslations();
  const form = useForm({
    ...config,
    defaultValues,
  });

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
    const hiddenSet = new Set(
      fields.filter(({ hidden }) => hidden).map(({ name }) => name)
    );

    return onSubmit(
      Object.entries(values).reduce((acc, [key, value]) => {
        if (hiddenSet.has(key as Path<TFieldValues>)) return acc;

        return {
          ...acc,
          [key]: value,
        };
      }, {} as TFieldValues),
      form
    );
  };

  // Form initialization callback
  useEffect(() => {
    onFormInit?.(form);
  }, [form, onFormInit]);

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
              required,
              intl = intlFields,
              autoComplete,
            }) => (
              <FormField
                control={control}
                name={name}
                disabled={disabled}
                render={({ field }) => (
                  <FormItem>
                    {label && (
                      <FormLabel className="flex flex-row gap-1">
                        {text(label, intl)}
                        {required && <span className="text-red-500">*</span>}
                      </FormLabel>
                    )}

                    {/* Rendering default input */}
                    {data.type === "input" && (
                      <FormControl>
                        <Input
                          placeholder={text(data.placeholder, intl)}
                          required={required}
                          {...{ autoComplete }}
                          {...field}
                          disabled={disabled || field.disabled}
                        />
                      </FormControl>
                    )}

                    {/* Rendering password input */}
                    {data.type === "password" && (
                      <FormControl>
                        <PasswordInput
                          placeholder={text(data.placeholder, intl)}
                          required={required}
                          {...{ autoComplete }}
                          {...field}
                          disabled={disabled || field.disabled}
                        />
                      </FormControl>
                    )}

                    {/* Rendering select */}
                    {data.type === "select" && (
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        required={required}
                        disabled={disabled || field.disabled}
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
                    <FormMessage className="mt-0 pt-0" />
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
