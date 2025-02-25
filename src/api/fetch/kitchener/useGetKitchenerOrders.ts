import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IKitchenerOrder } from "@/types/order.types";

export type GetOrdersParams = unknown;

export const useGetKitchenerOrders = buildApiHook<
  string,
  IKitchenerOrder[],
  GetOrdersParams,
  unknown
>({
  url: "/kitchener/orders",
  method: "GET",
  tags: [ApiCacheTag.KITCHENER_ORDERS],
});
