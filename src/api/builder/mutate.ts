import { mutate } from "swr";
import { ApiCacheTag } from "../types";

type key = ApiCacheTag | string;

export const mutateCache = (tags: key | key[]) => {
  return mutate(
    (key) => {
      if (typeof key === "string") {
        return tags.includes(key);
      }

      if (Array.isArray(key)) {
        return key.some((k) => tags.includes(k));
      }

      return false;
    },
    undefined,
    {
      revalidate: true,
    }
  );
};
