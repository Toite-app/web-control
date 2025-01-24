import {
  FormControl,
  FormDescription,
  FormField as UiFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

import { FormField } from "../types";
import { FieldValues } from "react-hook-form";
import { useRenderCount } from "@/hooks/useRenderCount";
import { cn } from "@/lib/utils";
import { PasswordInput } from "../../password-input";
import { Switch } from "@/components/ui/switch";
import { AddressSuggestionCombobox } from "./AddressSuggestionCombobox";
import { TimeSelect } from "./TimeSelect";
import { Textarea } from "@/components/ui/textarea";

// Create a separate FormField component to track individual field renders
const FormFieldWrapper = <TFieldValues extends FieldValues>({
  field,
  control,
  intlFields,
  text,
  errors,
  debug,
}: {
  field: FormField<TFieldValues>;
  control: Control<TFieldValues>;
  formValues: TFieldValues;
  intlFields: boolean;
  text: (text: string | undefined | null, intl: boolean) => string | undefined;
  errors: any;
  debug?: boolean;
}) => {
  const renderCount = useRenderCount(`FormField-${field.name}`, debug);
  const {
    className,
    name,
    label,
    description,
    data,
    disabled,
    required,
    intl = intlFields,
    autoComplete,
  } = field;

  return (
    <UiFormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field: formField }) => (
        <FormItem className={cn("relative col-span-12", className)}>
          {/* Only show render counter if debug is true */}
          {debug && (
            <div className="absolute right-0 top-0 rounded bg-muted px-1 text-xs text-muted-foreground">
              {renderCount}
            </div>
          )}

          {/* Rest of the existing FormField render code */}
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
                error={!!errors?.[name]}
                placeholder={text(data.placeholder, intl)}
                required={required}
                {...{ autoComplete }}
                {...formField}
                value={formField.value ?? ""}
                disabled={disabled || formField.disabled}
              />
            </FormControl>
          )}

          {/* Rendering password input */}
          {data.type === "password" && (
            <FormControl>
              <PasswordInput
                error={!!errors?.[name]}
                placeholder={text(data.placeholder, intl)}
                required={required}
                {...{ autoComplete }}
                {...formField}
                value={formField.value ?? ""}
                disabled={disabled || formField.disabled}
              />
            </FormControl>
          )}

          {/* Rendering select */}
          {data.type === "select" && (
            <Select
              value={formField.value ?? ""}
              onValueChange={formField.onChange}
              required={required}
              disabled={disabled || formField.disabled}
            >
              <FormControl>
                <SelectTrigger error={!!errors?.[name]}>
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
                  <SelectItem value={option.value} key={JSON.stringify(option)}>
                    <div className="flex flex-row items-center gap-2">
                      {option.icon}
                      <span>
                        {text(
                          option.label,
                          option.intl !== undefined ? option.intl : intl
                        )}
                      </span>
                    </div>
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
                {...formField}
                onChange={(e) => {
                  formField.onChange(Number(e.target.value));
                }}
                value={formField.value ?? ""}
                disabled={disabled || formField.disabled}
                error={!!errors?.[name]}
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
                {...formField}
                value={formField.value ?? ""}
                disabled={disabled || formField.disabled}
                error={!!errors?.[name]}
              />
            </FormControl>
          )}

          {/* Rendering switch */}
          {data.type === "switch" && (
            <FormControl>
              <Switch
                checked={formField.value}
                onCheckedChange={formField.onChange}
                disabled={disabled || formField.disabled}
              />
            </FormControl>
          )}

          {/* Rendering address suggestion combobox */}
          {data.type === "address-suggestion" && (
            <FormControl>
              <AddressSuggestionCombobox
                value={formField.value ?? ""}
                onChange={formField.onChange}
                placeholder={text(data.placeholder, intl)}
                language={data.language}
                provider={data.provider}
                disabled={disabled || formField.disabled}
                error={!!errors?.[name]}
              />
            </FormControl>
          )}

          {/* Rendering time select */}
          {data.type === "time-select" && (
            <FormControl>
              <TimeSelect
                value={formField.value ?? "00:00"}
                onChange={formField.onChange}
                disabled={disabled || formField.disabled}
                error={!!errors?.[name]}
              />
            </FormControl>
          )}

          {description && (
            <FormDescription>{text(description, intl)}</FormDescription>
          )}
          <FormMessage className="mt-0 pt-0" />
        </FormItem>
      )}
      key={String(name)}
    />
  );
};

export default FormFieldWrapper;
