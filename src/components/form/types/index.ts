import { ButtonProps } from "@/components/ui/button";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

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
  debug?: boolean;
};
