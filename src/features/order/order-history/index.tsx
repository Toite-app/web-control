"use client";

import { useGetOrderHistory } from "@/api/fetch/orders/history/useGetOrderHistory";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import HistoryItem from "@/features/order/order-history/components/HistoryItem";
import { groupBy } from "@/utils/array";
import format from "@/utils/date-fns";
import { useLocale } from "next-intl";

type Props = {
  orderId: string;
};

export default function OrderHistory({ orderId }: Props) {
  const { data, isLoading } = useGetOrderHistory({
    urlValues: {
      orderId,
    },
  });

  const locale = useLocale();

  // Group history items by date (YYYY-MM-DD)
  const groupedHistory = data?.data
    ? groupBy(data.data, (item) => format(item.createdAt, "yyyy-MM-dd", locale))
    : {};

  return (
    <Card>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] pr-2">
          <div className="flex flex-col gap-6 px-6 py-4">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, groupIndex) => (
                  <div key={groupIndex} className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex flex-col gap-4">
                      {[...Array(2)].map((_, itemIndex) => (
                        <Skeleton
                          key={itemIndex}
                          className="h-20 w-full rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date} className="flex flex-col gap-2">
                  <h3 className="text-base font-medium uppercase text-muted-foreground">
                    {format(date, "d MMMM yyyy", locale)}
                  </h3>
                  <div className="flex flex-col gap-4">
                    {items.map((item) => (
                      <HistoryItem key={item.id} history={item} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
