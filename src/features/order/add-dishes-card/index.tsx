"use client";

import { useGetDishCategories } from "@/api/fetch/dish-categories/useGetDishCategories";
import { GetDishesParams, useGetDishes } from "@/api/fetch/dishes/useGetDishes";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useDebouncedValue from "@/hooks/use-debounced-value";
import { buildFiltersParam } from "@/lib/filters";
import { IDishCategory } from "@/types/dish-category.types";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import OrderDishCard from "./components/DishCard";

type Props = {
  orderId: string;
};

export default function AddOrderDishesCard(props: Props) {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<string>("none");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const categories = useGetDishCategories({
    params: {
      filters: buildFiltersParam<IDishCategory>([
        {
          field: "showForWorkers",
          condition: "equals",
          value: "true",
        },
      ]),
    },
  });

  const dishesParams = useMemo<GetDishesParams>(() => {
    return {
      ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
      ...(selectedCategory !== "none" && {
        filters: buildFiltersParam([
          {
            field: "categoryId",
            condition: "equals",
            value: selectedCategory,
          },
        ]),
      }),
    };
  }, [debouncedSearchQuery, selectedCategory]);

  const dishes = useGetDishes({
    params: dishesParams,
  });

  // When search input has text, reset and disable category select
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value && selectedCategory !== "none") {
      setSelectedCategory("none");
    }
  };

  return (
    <Card className="flex w-full flex-col gap-2 p-4">
      <div className="flex flex-row items-center gap-2">
        <h2 className="text-xl font-semibold">
          {t("Orders.add-dishes.title")}
        </h2>
      </div>
      <Separator className="mb-2" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
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
              {(categories.data?.data ?? [])
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dishes.data?.data.map((dish) => (
            <OrderDishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </Card>
  );
}
