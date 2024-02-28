import { FormInstance } from "@/components/form";
import { isAxiosError } from "axios";
import { useMessages } from "next-intl";
import { useCallback } from "react";

export const isApiHandledError = (error: any) => {
  if (!isAxiosError(error)) {
    return false;
  }

  if (
    typeof error.response?.data !== "object" ||
    !("errorCode" in error.response?.data)
  ) {
    return false;
  }

  return true;
};

export enum ApiErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
  FORBIDDEN = "FORBIDDEN",
  FORM = "FORM",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export enum ApiErrorCategory {
  WORKERS = "WORKERS",
}

export type FormExceptionDetail = {
  property: string;
  constraints?: Record<string, string>;
  message: string;
};

export type DetailedMessage<T = any> = {
  title: string;
  description?: string;
  details?: T;
};

export type ApiError<T = any> = {
  statusCode: number;
  errorCode: ApiErrorCode;
  errorCategory: ApiErrorCategory;
  errorSubCode: string | null;
  message: string | DetailedMessage<T>;
  pathname: string;
  timestamp: number;
};

export const useErrorHandler = () => {
  const messages = useMessages() as any;
  const errors = messages.apiErrors as any;

  const getErrorMessage = useCallback(
    (data: ApiError) => {
      const errorCategory = data.errorCategory.toLowerCase();
      const errorCode = data.errorCode.toLocaleLowerCase();
      const errorSubCode = data.errorSubCode?.toLowerCase() || "";

      const defaultMessage = errors.default?.[errorCode];
      const categoryMessage =
        errors?.[errorCategory]?.[errorCode]?.[errorSubCode];

      return categoryMessage || defaultMessage || errorCode;
    },
    [errors]
  );

  const handleFormError = useCallback(
    (data: ApiError, form: FormInstance<any>) => {
      const message = data.message as DetailedMessage<FormExceptionDetail[]>;
      const details = message.details || [];

      for (const { property, message, constraints } of details) {
        const contraintKey = Object.keys(constraints || {})?.[0] ?? "";
        const contraintMessage =
          errors?.[data.errorCategory.toLowerCase()]?.form?.[
            property.toLowerCase()
          ]?.[contraintKey];

        form.setError(property, {
          message: contraintMessage || message,
        });
      }

      return message.title;
    },
    [errors]
  );

  return useCallback(
    (opts: { error: any; form: FormInstance<any> }) => {
      const { error, form } = opts;

      let message = errors.default.unknown;

      if (isAxiosError(error) && isApiHandledError(error)) {
        const data = error.response?.data as ApiError;

        if (
          typeof data.message === "object" &&
          "details" in data.message &&
          form
        ) {
          return handleFormError(data, form);
        }

        const newMessage = getErrorMessage(data);

        if (newMessage) message = newMessage;
      }

      if (form) {
        form.setError("root", { message });
      }

      return message;
    },
    [errors, getErrorMessage, handleFormError]
  );
};
