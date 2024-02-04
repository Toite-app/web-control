import { buildApiMutation } from "../hook-builder";

export const logoutMutation = buildApiMutation<void, void, string>({
  url: "/auth/sign-out",
  method: "DELETE",
});
