import { FormInstance } from "@/components/form";
import { isAxiosError } from "axios";
import { useCallback } from "react";

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
};

export const useErrorHandler = () => {
  const handleValidationErrors = useCallback(
    (error: ApiError, form: FormInstance<any>) => {
      if (!error.validationErrors) return;

      const unhandledErrors: string[] = [];

      error.validationErrors.forEach((validationError) => {
        const fieldName = validationError.property;
        const errorMessages = Object.values(validationError.constraints);

        // Check if form has field with this name
        if (form.getFieldState(fieldName)) {
          form.setError(fieldName, {
            type: "server",
            message: errorMessages?.[0] ?? error.message,
          });
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
      const { error, form } = options;

      if (isAxiosError(error) && error.response?.data) {
        const apiError = error.response.data as ApiError;

        if (
          form &&
          apiError.validationErrors &&
          apiError.validationErrors.length > 0
        ) {
          handleValidationErrors(apiError, form);
        } else if (form) {
          form.setError("root", {
            type: "server",
            message: apiError.message,
          });
        }
        return;
      }

      // Handle unknown errors
      if (form) {
        form.setError("root", {
          type: "server",
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    },
    [handleValidationErrors]
  );

  return handleError;
};
