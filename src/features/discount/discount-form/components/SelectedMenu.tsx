"use client";

import { useGetDishCategories } from "@/api/fetch/dish-categories/useGetDishCategories";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DiscountFormMenu,
  DiscountFormValues,
} from "@/features/discount/discount-form";
import { buildFiltersParam } from "@/lib/filters";
import { TrashIcon, UtensilsCrossedIcon, StoreIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Control, useFormContext } from "react-hook-form";

type Props = {
  field: DiscountFormMenu;
  control: Control<DiscountFormValues>;
  index: number;
  onRemove: () => void;
};

export default function SelectedMenu(props: Props) {
  const { field, index, onRemove } = props;
  const { menu } = field;

  const t = useTranslations();

  const [tab, setTab] = useState<"restaurants" | "categories">("restaurants");

  const { watch, setValue } = useFormContext();

  const selectedRestaurantIds = watch(`menus.${index}.selectedRestaurantIds`);
  const selectedCategoryIds = watch(`menus.${index}.selectedCategoryIds`);

  const dishCategories = useGetDishCategories({
    params: {
      filters: buildFiltersParam([
        {
          field: "menuId",
          condition: "equals",
          value: menu.id,
        },
      ]),
      size: 100,
    },
    config: { keepPreviousData: true },
    skip: !menu.id,
  });

  return (
    <Card className=" min-w-[300px] max-w-[300px] p-0">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col px-4 pt-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase text-stone-500">
                {menu.owner.name}
              </span>
              <h3 className="text-base font-bold">{menu.name}</h3>
            </div>
            <Popover>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("Discounts.form.remove-menu-tooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent className="w-80" side="bottom">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      {t("Discounts.form.remove-menu-confirm-title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("Discounts.form.remove-menu-confirm-description", {
                        menuName: menu.name,
                      })}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      {t("common.cancel")}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={onRemove}>
                      {t("Discounts.form.remove-menu-confirm-button")}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Separator className="my-2" />
          <ToggleGroup
            type="single"
            className="flex flex-row gap-2"
            value={tab}
            onValueChange={(value) =>
              setTab(value as "restaurants" | "categories")
            }
          >
            <ToggleGroupItem className="w-full" value="restaurants" size="sm">
              {t("Discounts.form.restaurants")}
            </ToggleGroupItem>
            <ToggleGroupItem className="w-full" value="categories" size="sm">
              {t("Discounts.form.categories")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="">
            <div className="flex flex-col gap-2 px-4">
              {tab === "restaurants" && (
                <div className="flex flex-col gap-2">
                  {menu.restaurants?.length > 0 ? (
                    <ToggleGroup
                      type="multiple"
                      className="flex flex-col gap-2"
                      value={selectedRestaurantIds}
                      onValueChange={(value) =>
                        setValue(`menus.${index}.selectedRestaurantIds`, value)
                      }
                    >
                      {(menu.restaurants || []).map((restaurant) => (
                        <ToggleGroupItem
                          className="group w-full min-w-[80px] justify-start border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                          size="sm"
                          key={restaurant.id}
                          value={restaurant.id}
                        >
                          {restaurant.name}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                      <StoreIcon className="mb-2 h-12 w-12" />
                      <p className="text-sm">
                        {t("Discounts.form.no-restaurants")}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {tab === "categories" && (
                <div className="flex flex-col gap-2">
                  {dishCategories.data &&
                  dishCategories?.data?.data?.length > 0 ? (
                    <ToggleGroup
                      type="multiple"
                      className="flex flex-col gap-2"
                      value={selectedCategoryIds}
                      onValueChange={(value) =>
                        setValue(`menus.${index}.selectedCategoryIds`, value)
                      }
                    >
                      {(dishCategories.data?.data || [])
                        .sort((a, b) => a.sortIndex - b.sortIndex)
                        .map((category) => (
                          <ToggleGroupItem
                            className="group w-full min-w-[80px] justify-start border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                            size="sm"
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                      <UtensilsCrossedIcon className="mb-2 h-12 w-12" />
                      <p className="text-sm">
                        {t("Discounts.form.no-categories")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </Card>
  );
}
