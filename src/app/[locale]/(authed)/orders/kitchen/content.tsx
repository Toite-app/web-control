"use client";

import { useGetKitchenerOrders } from "@/api/fetch/kitchener/useGetKitchenerOrders";
import KitchenerOrderCard from "@/features/order-card/kitchener";

export default function KitchenOrdersPageContent() {
  const orders = useGetKitchenerOrders();

  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orders.data?.map((order) => (
          <KitchenerOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
