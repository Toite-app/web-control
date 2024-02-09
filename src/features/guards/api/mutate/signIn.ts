import { buildApiMutation } from "@/api/builder/mutation";
import { IWorker } from "@/types/worker.types";

export type SignInPayload = {
  login: string;
  password: string;
};

export const signInMutation = buildApiMutation<
  string,
  IWorker,
  unknown,
  SignInPayload
>({
  url: "/auth/sign-in",
  method: "POST",
});
