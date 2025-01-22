"use client";
import { useGetDispatcherOrders } from "@/api/fetch/dispatcher/useGetDispatcherOrders";
import { Separator } from "@/components/ui/separator";
import DispatcherOrderCard from "@/features/order-card/dispatcher";
import { ShieldAlertIcon } from "lucide-react";

export default function OrdersPageContent() {
  const orders = useGetDispatcherOrders({
    params: {
      limit: 100,
    },
  });

  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <div className="flex flex-row items-center gap-2">
        <ShieldAlertIcon className="h-6 w-6 text-red-500" />
        <span className="text-2xl font-bold text-red-500">
          Требуют внимания
        </span>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orders.data?.data.map((order) => (
          <DispatcherOrderCard order={order} key={order.id} />
        ))}
      </div>
    </div>
  );
}
