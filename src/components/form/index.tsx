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
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { AddressSuggestionCombobox } from "./components/AddressSuggestionCombobox";
import { TimeSelect } from "./components/TimeSelect";
import { Textarea } from "../ui/textarea";

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
  intl?: boolean;
  withEmptyOption?: boolean;
  options: {
    label: string;
    value: string;
    intl?: boolean;
  }[];
};

export type NumberInputFormField = {
  type: "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

export type SwitchFormField = {
  type: "switch";
};

export type AddressSuggestionFormField = {
  type: "address-suggestion";
  placeholder?: string;
  language?: string;
  provider?: "dadata" | "google";
};

export type TimeSelectFormField = {
  type: "time-select";
};

export type TextareaFormField = {
  type: "textarea";
  placeholder?: string;
  rows?: number;
};

export type FormField<TFieldValues> = {
  className?: string;
  name: Path<TFieldValues>;
  data:
    | InputFormField
    | SelectFormField
    | PasswordInputFormField
    | NumberInputFormField
    | SwitchFormField
    | AddressSuggestionFormField
    | TimeSelectFormField
    | TextareaFormField;
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
  form: FormInstance<TFieldValues>;
  fields: FormField<TFieldValues>[];
  onSubmit: (values: TFieldValues, form: FormInstance<TFieldValues>) => void;
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
    form,
    fields,
    onSubmit,
    submitButton,
    intlFields = false,
  } = props;

  const t = useTranslations();

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

  return (
    // Shadcn/ui wrapper
    <UiForm {...form}>
      <form
        className={cn("grid w-full grid-cols-12 gap-2", className)}
        onSubmit={handleSubmit(proxySubmit)}
      >
        {fields
          .filter(({ hidden }) => !hidden)
          .map(
            ({
              className,
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
                  <FormItem className={cn("col-span-12", className)}>
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
                          value={field.value ?? ""}
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
                          value={field.value ?? ""}
                          disabled={disabled || field.disabled}
                        />
                      </FormControl>
                    )}

                    {/* Rendering select */}
                    {data.type === "select" && (
                      <Select
                        // defaultValue={field.value ?? ""}
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        required={required}
                        disabled={disabled || field.disabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={text(
                                data.placeholder,
                                data.intl !== undefined ? data.intl : intl
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.withEmptyOption && (
                            <SelectItem value={null!}>
                              {text("fields.empty", true)}
                            </SelectItem>
                          )}
                          {data.options.map((option) => (
                            <SelectItem
                              value={option.value}
                              key={JSON.stringify(option)}
                            >
                              {text(
                                option.label,
                                option.intl !== undefined ? option.intl : intl
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {/* Rendering number input */}
                    {data.type === "number" && (
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={text(data.placeholder, intl)}
                          required={required}
                          min={data.min}
                          max={data.max}
                          step={data.step}
                          {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                          value={field.value ?? ""}
                          disabled={disabled || field.disabled}
                        />
                      </FormControl>
                    )}

                    {/* Rendering textarea */}
                    {data.type === "textarea" && (
                      <FormControl>
                        <Textarea
                          placeholder={text(data.placeholder, intl)}
                          required={required}
                          rows={data.rows}
                          {...field}
                          value={field.value ?? ""}
                          disabled={disabled || field.disabled}
                        />
                      </FormControl>
                    )}

                    {/* Rendering switch */}
                    {data.type === "switch" && (
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={disabled || field.disabled}
                        />
                      </FormControl>
                    )}

                    {/* Rendering address suggestion combobox */}
                    {data.type === "address-suggestion" && (
                      <FormControl>
                        <AddressSuggestionCombobox
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder={text(data.placeholder, intl)}
                          language={data.language}
                          provider={data.provider}
                          disabled={disabled || field.disabled}
                        />
                      </FormControl>
                    )}

                    {/* Rendering time select */}
                    {data.type === "time-select" && (
                      <FormControl>
                        <TimeSelect
                          value={field.value ?? "00:00"}
                          onChange={field.onChange}
                          disabled={disabled || field.disabled}
                        />
                      </FormControl>
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
        {errors.root && (
          <FormMessage className="col-span-12">
            {errors.root.message}
          </FormMessage>
        )}

        <Button
          variant="default"
          {...submitButton}
          type="submit"
          className={cn("col-span-12 mt-4", submitButton.className)}
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
