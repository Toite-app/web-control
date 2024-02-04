import { AuthedUser } from "../fetch/useAuthedUser";
import { buildApiMutation } from "../hook-builder";

export type SignInPayload = {
  login: string;
  password: string;
};

export const signInMutation = buildApiMutation<
  AuthedUser,
  SignInPayload,
  string
>({
  url: "/auth/sign-in",
  method: "POST",
});
