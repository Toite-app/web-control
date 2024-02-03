import pupa from "pupa";

export type BuildUrlInput<ValuesKeys extends string> =
  | string
  | {
      path: string;
      values: Record<ValuesKeys, string>;
    };

export const buildUrl = <ValuesKeys extends string>(
  input: BuildUrlInput<ValuesKeys>
): string => {
  if (typeof input === "string") {
    return input;
  }

  const { path, values } = input;

  return pupa(path, values);
};
