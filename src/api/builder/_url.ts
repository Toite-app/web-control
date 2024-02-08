import pupa from "pupa";

export const _buildUrl = (
  input: string,
  values?: Record<string, string | number>
): string => {
  if (!values) {
    return input;
  }

  return pupa(input, values);
};
