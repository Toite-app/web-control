"use client";
import { useGetOrders } from "@/api/fetch/orders/useGetOrders";
import DispatcherOrderCard from "@/features/order-card/dispatcher";

export default function OrdersPageContent() {
  const orders = useGetOrders();

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orders.data?.data.map((order) => (
          <DispatcherOrderCard order={order} key={order.id} />
        ))}
      </div>
    </div>
  );
}
