"use client";

import { useGetKitchenerOrders } from "@/api/fetch/kitchener/useGetKitchenerOrders";
import KitchenerOrderCard from "@/features/order-card/kitchener";
import Masonry from "react-masonry-css";

export default function KitchenOrdersPageContent() {
  const orders = useGetKitchenerOrders({
    config: {
      keepPreviousData: true,
    },
  });

  const breakpointColumns = {
    default: 4,
    1536: 3, // xl breakpoint
    1024: 2, // lg breakpoint
    640: 1, // sm breakpoint
  };

  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <Masonry
        breakpointCols={breakpointColumns}
        className="-ml-4 flex w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {orders.data?.map((order) => (
          <div key={order.id} className="mb-4">
            <KitchenerOrderCard order={order} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
