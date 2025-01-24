"use client";

import { Form as UiForm, FormMessage } from "@/components/ui/form";
import { FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import FormFieldWrapper from "./components/FieldWrapper";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";

import { useRenderCount } from "@/hooks/useRenderCount";
import { FormProps } from "./types";

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
    debug = false,
  } = props;

  const renderCount = useRenderCount("Form", debug);
  const t = useTranslations();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = form;

  // Watch all form values for className callbacks
  // const formValues = watch();
  const formValues = {} as TFieldValues;

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
        {/* Only show form render counter if debug is true */}
        {debug && (
          <div className="col-span-12 text-right text-xs text-muted-foreground">
            Form renders: {renderCount}
          </div>
        )}

        {fields
          .filter(({ hidden }) => !hidden)
          .map((field) => (
            <FormFieldWrapper
              key={String(field.name)}
              field={field}
              control={control}
              formValues={formValues as TFieldValues}
              intlFields={intlFields}
              text={text}
              errors={errors}
              debug={debug}
            />
          ))}

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
