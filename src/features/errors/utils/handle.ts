import { isAxiosError } from "axios";

export type ApiError = {
  code: string;
};

export const handleApiError = (err: unknown) => {
  console.error(err);
  if (isAxiosError(err)) {
    // const errCode = err.response?.data?.errorCode;

    return {};
  }
};
