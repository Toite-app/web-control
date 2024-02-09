import { buildApiMutation } from "@/api/builder/mutation";

export const logoutMutation = buildApiMutation<
  string,
  unknown,
  unknown,
  unknown
>({
  url: "/auth/sign-out",
  method: "DELETE",
});
