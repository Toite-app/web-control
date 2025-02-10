import { buildApiHook } from "@/api/builder/hook";
import { ApiCacheTag } from "@/api/types";
import { IOrder } from "@/types/order.types";

export const useGetOrder = buildApiHook<
  { orderId: string },
  IOrder,
  unknown,
  unknown
>({
  url: "/orders/{orderId}",
  method: "GET",
  tags: ({ urlValues }) => [
    ApiCacheTag.ORDERS,
    `${ApiCacheTag.ORDERS}:${urlValues?.orderId}`,
  ],
});
