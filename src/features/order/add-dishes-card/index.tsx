"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useDebouncedValue from "@/hooks/use-debounced-value";
import { AlertCircle, Search, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import OrderDishCard from "./components/DishCard";
import { IOrder } from "@/types/order.types";
import { cn } from "@/lib/utils";
import {
  GetOrderMenuDishesParams,
  useGetOrderMenuDishes,
} from "@/api/fetch/orders/menu/useGetOrderMenuDishes";
import { useGetOrderMenuDishCategories } from "@/api/fetch/orders/menu/useGetOrderMenuDishCategories";

type Props = {
  order?: IOrder | null;
};

export default function AddOrderDishesCard(props: Props) {
  const { order } = props;
  const t = useTranslations();

  const accordionSetted = useRef(false);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("none");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const categories = useGetOrderMenuDishCategories({
    urlValues: {
      orderId: String(order?.id),
    },
    skip: !order?.id,
  });

  const dishesParams = useMemo<GetOrderMenuDishesParams>(() => {
    return {
      ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
      ...(selectedCategoryId !== "none" && {
        categoryId: selectedCategoryId,
      }),
    };
  }, [debouncedSearchQuery, selectedCategoryId]);

  const dishes = useGetOrderMenuDishes({
    params: dishesParams,
    urlValues: {
      orderId: String(order?.id),
    },
    config: {
      keepPreviousData: true,
    },
    skip: !order?.id,
  });

  // When search input has text, reset and disable category select
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value && selectedCategoryId !== "none") {
      setSelectedCategoryId("none");
    }
  };

  const isRestaurantAssigned = order?.restaurantId != null;

  useEffect(() => {
    if (!order || accordionSetted.current) return;

    if (order.status === "pending") {
      setAccordionValue("dishes");
    }

    accordionSetted.current = true;
  }, [order]);

  return (
    <Card className="flex w-full flex-col gap-2 p-4 py-0">
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <AccordionItem className="border-b-0" value="dishes">
          <AccordionTrigger className="border-b-0">
            <div className="flex flex-row items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              <h2 className="text-xl font-semibold">
                {t("Orders.add-dishes.title")}
              </h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              {!isRestaurantAssigned && (
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4 !text-orange-500" />
                  <AlertTitle>
                    {t("Orders.add-dishes.no-restaurant-warning")}
                  </AlertTitle>
                  <AlertDescription>
                    {t("Orders.add-dishes.no-restaurant-warning-description")}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                  disabled={searchQuery.length > 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("Orders.add-dishes.category-placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("Orders.add-dishes.none-category")}
                    </SelectItem>
                    {(categories?.data ?? [])
                      .sort((a, b) => a.sortIndex - b.sortIndex)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-9"
                    placeholder={t("Orders.add-dishes.search-placeholder")}
                  />
                </div>
              </div>

              <ScrollArea className="relative h-[500px] rounded-md">
                <div
                  className={cn(
                    "grid grid-cols-1 gap-4 pr-4 sm:grid-cols-2",
                    !isRestaurantAssigned && "pointer-events-none opacity-50"
                  )}
                >
                  {dishes.data?.data.map((dish) => (
                    <OrderDishCard key={dish.id} dish={dish} order={order} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
