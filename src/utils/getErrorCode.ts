import { AxiosError } from "axios";

export const ERR_MESSAGE_TO_CODE: Record<string, string> = {
  "User not found": "user-not-found",
};

export const getErrorCode = (err: AxiosError): string | null => {
  const message = (err.response?.data as any)?.message;

  if (!message) return null;

  return ERR_MESSAGE_TO_CODE?.[message] || null;
};
