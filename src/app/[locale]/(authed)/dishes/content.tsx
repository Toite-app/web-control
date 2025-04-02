"use client";

import { useGetDishes } from "@/api/fetch/dishes/useGetDishes";
import { Button } from "@/components/ui/button";
import DishCategoriesList from "@/features/dish-categories/list";
import useDialogsStore from "@/store/dialogs-store";
import { PlusIcon, SearchIcon, SearchXIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import DishCard from "@/features/dishes/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@/navigation";
import { Input } from "@/components/ui/input";
import useDebouncedValue from "@/hooks/use-debounced-value";
import { parseAsString, useQueryState } from "nuqs";
import DishesMenuSelect from "@/features/dishes/menu-select";
import { useState } from "react";

export default function DishesPageContent() {
  const t = useTranslations();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const debouncedSearch = useDebouncedValue(search, 500);

  const dishes = useGetDishes({
    params: {
      menuId: String(menuId),
      ...(debouncedSearch && debouncedSearch.length > 0
        ? { search: debouncedSearch }
        : {}),
      ...(selectedCategoryId && { categoryId: selectedCategoryId }),
    },
    skip: !menuId,
  });

  const toggleDialog = useDialogsStore((state) => state.toggle);

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-screen-2xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4">
              <h1 className="text-4xl font-bold">{t("navbar.dishes")}</h1>
              <Badge className="rounded-lg" variant="default">
                {dishes.data?.meta.total ?? "-"}
              </Badge>
            </div>
            <p className="text-stone-500">{t("Dishes.page.description")}</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <Input
                className="w-[300px] pl-9"
                placeholder={t("Dishes.page.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              className="flex flex-row items-center gap-2"
              variant="default"
              onClick={() => {
                toggleDialog("dish", true, {
                  menuId,
                });
              }}
            >
              <PlusIcon className="h-5 w-5" />
              <span className="text-[16px]">{t("Dishes.page.create")}</span>
            </Button>
          </div>
        </header>
        <div className="flex flex-row gap-4">
          <div className="flex max-h-[80vh] min-h-[80vh] w-full max-w-[300px] flex-col gap-2">
            <DishesMenuSelect
              value={menuId}
              onChange={(value) => {
                setSearch("");
                setMenuId(value?.id || null);
                setSelectedCategoryId(null);
              }}
              autoselectAvailable
            />
            <DishCategoriesList
              className=""
              menuId={menuId}
              selectedCategoryId={selectedCategoryId}
              onSelect={(category) => {
                if (category.id !== selectedCategoryId) {
                  setSelectedCategoryId(category.id);
                  setSearch("");
                } else {
                  setSelectedCategoryId(null);
                }
              }}
            />
          </div>
          <ScrollArea className="max-h-[80vh] min-h-[80vh] flex-1 rounded-md">
            {dishes.data?.data.length === 0 ? (
              <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 p-8">
                <SearchXIcon className="h-12 w-12 text-stone-300" />
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-lg font-medium text-stone-500">
                    {t("Dishes.page.no-results")}
                  </p>
                  {debouncedSearch && (
                    <p className="text-sm text-stone-400">
                      {t("Dishes.page.try-different-search")}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {dishes.data?.data.map((dish) => (
                  <Link
                    key={dish.id}
                    href={{
                      pathname: "/dishes/[dishId]",
                      params: { dishId: dish.id },
                    }}
                  >
                    <DishCard
                      className="cursor-pointer transition-all hover:bg-stone-100 dark:hover:bg-stone-800"
                      data={dish}
                    />
                  </Link>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
