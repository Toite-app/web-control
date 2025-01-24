"use client";
import { useGetDispatcherAttentionOrders } from "@/api/fetch/dispatcher/useGetDispatcherAttentionOrders";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DispatcherOrderCard from "@/features/order-card/dispatcher";
import { ClockIcon, PlusIcon, SearchIcon, ShieldAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Backpack } from "@phosphor-icons/react/dist/ssr/Backpack";
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck";
import { Cheers } from "@phosphor-icons/react/dist/ssr/Cheers";
import { OrderType } from "@/types/order.types";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { useGetDispatcherDelayedOrders } from "@/api/fetch/dispatcher/useGetDispatcherDelayedOrders";
import { Link } from "@/navigation";
import { useGetDispatcherOrders } from "@/api/fetch/dispatcher/useGetDispatcherOrders";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function OrdersPageContent() {
  const t = useTranslations();
  const [type, setType] = useQueryState(
    "type",
    parseAsString.withDefault("all")
  );
  const [search, setSearch] = useState("");

  const orders = useGetDispatcherOrders({
    params: {
      type: type === "all" ? undefined : (type as OrderType),
    },
  });

  const attentionOrders = useGetDispatcherAttentionOrders({
    params: {
      type: type === "all" ? undefined : (type as OrderType),
    },
  });

  const delayedOrders = useGetDispatcherDelayedOrders({
    params: {
      type: type === "all" ? undefined : (type as OrderType),
    },
  });

  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <Tabs value={type} onValueChange={setType}>
          <TabsList>
            <TabsTrigger value="all">{t("navbar.orders-all")}</TabsTrigger>
            <TabsTrigger value="hall" className="flex items-center gap-2">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 7.5C22 5.57 17.52 4 12 4S2 5.57 2 7.5c0 1.81 3.95 3.31 9 3.48V15H9.35c-.82 0-1.55.5-1.86 1.26L6 20h2l1.2-3h5.6l1.2 3h2l-1.5-3.74c-.3-.76-1.04-1.26-1.85-1.26H13v-4.02c5.05-.17 9-1.67 9-3.48z"></path>
              </svg>
              {t("navbar.orders-hall")}
            </TabsTrigger>
            <TabsTrigger value="banquet" className="flex items-center gap-2">
              <Cheers className="h-4 w-4" weight="fill" />
              {t("navbar.orders-banquet")}
            </TabsTrigger>
            <TabsTrigger value="takeaway" className="flex items-center gap-2">
              <Backpack className="h-4 w-4" weight="fill" />
              {t("navbar.orders-takeaway")}
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" weight="fill" />
              {t("navbar.orders-delivery")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative w-[300px]">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={t("Orders.search-placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link href="/orders/create">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              {t("Orders.create-order")}
            </Button>
          </Link>
        </div>
      </div>
      <Separator />
      {attentionOrders.data?.data && attentionOrders.data?.data.length > 0 && (
        <>
          <div className="flex flex-row items-center gap-2">
            <ShieldAlertIcon className="h-6 w-6 text-red-500" />
            <span className="text-2xl font-bold text-red-500">
              {t("Orders.attention-required")}
            </span>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {attentionOrders.data?.data.map((order) => (
              <Link
                href={{
                  pathname: "/orders/[orderId]",
                  params: { orderId: order.id },
                }}
                key={order.id}
              >
                <DispatcherOrderCard
                  className="shadow-[0_0_8px_rgba(239,68,68,0.9)]"
                  order={order}
                />
              </Link>
            ))}
          </div>
        </>
      )}
      <Separator />
      {orders.data?.data && orders.data.data.length > 0 && (
        <>
          <div className="flex flex-row items-center gap-2">
            <span className="text-2xl font-bold text-red-500">
              {/* {t("Orders.attention-required")} */}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {orders.data.data.map((order) => (
              <Link
                className="h-full"
                href={{
                  pathname: "/orders/[orderId]",
                  params: { orderId: order.id },
                }}
                key={order.id}
              >
                <DispatcherOrderCard order={order} />
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-row items-center gap-2">
        <ClockIcon className="h-6 w-6 text-stone-500" />
        <span className="text-2xl font-bold text-stone-500">
          {t("Orders.delayed-orders")}
        </span>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {delayedOrders.data?.data.map((order) => (
          <Link
            href={{
              pathname: "/orders/[orderId]",
              params: { orderId: order.id },
            }}
            key={order.id}
          >
            <DispatcherOrderCard order={order} />
          </Link>
        ))}
      </div>
    </div>
  );
}
