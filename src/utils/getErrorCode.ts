import { AxiosError } from "axios";
import slugify from "slugify";

export const getErrorCode = (err: AxiosError): string | null => {
  const message = (err.response?.data as any)?.message;

  if (!message) return null;

  return slugify(message, {
    lower: true,
    strict: true,
    trim: true,
    // remove: {
    //   " ": "-",
    //   "/": "-",
    //   ".": "-",
    //   ",": "-",
    //   ":": "-",
    //   ";": "-",
    //   "'": "",
    //   '"': "",
    //   "!": "",
    // },
    remove: /[^a-zA-Z0-9-]/g,
  });
};
