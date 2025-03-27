import { FormInstance } from "@/components/form/types";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

type ErrorText = string;

export type ValidationError = {
  property: string;
  constraints: Record<string, ErrorText>;
};

export type ApiError = {
  message: string;
  path: string;
  statusCode: number;
  timestamp: number;
  validationErrors?: ValidationError[];
};

export type ErrorHandlerOptions = {
  error: unknown;
  form?: FormInstance<any>;
  handleFieldsAsRootErrors?: string[];
};

export const useErrorHandler = () => {
  const { toast } = useToast();
  const t = useTranslations();

  const handleValidationErrors = useCallback(
    (
      error: ApiError,
      form: FormInstance<any>,
      handleFieldsAsRootErrors?: string[]
    ) => {
      if (!error.validationErrors) return;

      const unhandledErrors: string[] = [];
      const handleAsRootNamesSet = new Set(handleFieldsAsRootErrors);

      error.validationErrors.forEach((validationError) => {
        const fieldName = validationError.property;
        const errorMessages = Object.values(validationError.constraints);

        // Check if form has field with this name
        if (form.getFieldState(fieldName)) {
          if (handleAsRootNamesSet.has(fieldName)) {
            form.setError(fieldName, {
              type: "server",
              message: "",
            });
            unhandledErrors.push(...errorMessages);
          } else {
            form.setError(fieldName, {
              type: "server",
              message: errorMessages?.[0] ?? error.message,
            });
          }
        } else {
          // Collect errors for fields that don't exist in the form
          unhandledErrors.push(...errorMessages);
        }
      });

      // If we have unhandled errors, set them as root errors
      if (unhandledErrors.length > 0) {
        form.setError("root", {
          type: "server",
          message: unhandledErrors.join(". "),
        });
      }
    },
    []
  );

  const handleError = useCallback(
    (options: ErrorHandlerOptions) => {
      const { error, form, handleFieldsAsRootErrors } = options;

      if (isAxiosError(error) && error.response?.data) {
        const apiError = error.response.data as ApiError;
        const status = error.response.status;

        console.log(apiError);

        // Handle 500 errors
        if (status === 500) {
          toast({
            variant: "destructive",
            description: t("errors.server-error"),
          });
          return;
        }

        if (
          form &&
          apiError.validationErrors &&
          apiError.validationErrors.length > 0
        ) {
          handleValidationErrors(apiError, form, handleFieldsAsRootErrors);
        } else if (form) {
          form.setError("root", {
            type: "server",
            message: apiError.message,
          });
        } else {
          toast({
            variant: "destructive",
            description: apiError.message,
          });
        }
        return;
      }

      // Handle unknown errors
      if (form) {
        form.setError("root", {
          type: "server",
          message: error instanceof Error ? error.message : t("errors.unknown"),
        });
      }

      toast({
        variant: "destructive",
        description:
          error instanceof Error ? error.message : t("errors.unknown"),
      });
    },
    [handleValidationErrors, toast, t]
  );

  return handleError;
};
