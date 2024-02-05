import { UserRole } from "@/api/fetch/useAuthedUser";
import { buildApiMutation } from "@/api/hook-builder";
import { z } from "zod";

export const createWorkerPayload = z.object({
  name: z.string(),
  login: z.string(),
  restaurantId: z.string().nullable(),
  password: z.string(),
  role: z.nativeEnum(UserRole),
});

export type CreateWorkerPayload = z.infer<typeof createWorkerPayload>;

export const createWorkerMutation = buildApiMutation<
  void,
  CreateWorkerPayload,
  string
>({
  url: "/workers",
  method: "POST",
});
