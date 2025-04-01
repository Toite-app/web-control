"use client";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetRestaurants } from "@/features/restaurants/api/useGetRestaurants";
import { useSorting } from "@/components/data-table/hooks/useSorting";
import { usePagination } from "@/components/data-table/hooks/usePagination";
import { useGetColumns } from "@/features/restaurants/components/data-table/hooks/useGetColumns";
import useDialogsStore from "@/store/dialogs-store";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/components/ui/multiple-select";
import { useEffect, useRef, useState } from "react";

export const RestaurantsPageContent = () => {
  const t = useTranslations();

  const toggleDialog = useDialogsStore((state) => state.toggle);

  const columns = useGetColumns({
    onEdit: (restaurant) => {
      toggleDialog("restaurant", true, restaurant);
    },
  });

  const sorting = useSorting();
  const pagination = usePagination();
  const searchPaginationReseted = useRef<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const restaurants = useGetRestaurants({
    params: {
      page: pagination.state.pageIndex + 1,
      size: pagination.state.pageSize,
      ...(sorting.sortBy
        ? {
            sortBy: sorting.sortBy,
            sortOrder: sorting.sortOrder,
          }
        : {}),
      ...(debouncedSearch.trim().length > 0
        ? {
            search: debouncedSearch.trim(),
          }
        : {}),
    },
    config: {
      keepPreviousData: true,
    },
  });

  useEffect(() => {
    const search = debouncedSearch.trim();

    if (
      search.length > 0 &&
      pagination.state.pageIndex > 0 &&
      searchPaginationReseted.current !== search
    ) {
      pagination.onChange({
        pageIndex: 0,
        pageSize: pagination.state.pageSize,
      });

      searchPaginationReseted.current = search;
    }
  }, [debouncedSearch, pagination]);

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4">
              <h1 className=" text-4xl font-bold">{t("navbar.restaurants")}</h1>
              <Badge className="rounded-lg" variant="default">
                {restaurants.data?.meta.total || "-"}
              </Badge>
            </div>
            <p className="text-stone-500">
              {t("Restaurants.page.description")}
            </p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Input
              className="w-64 "
              placeholder={t("Restaurants.page.search-placeholder")}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className="flex flex-row items-center gap-2"
              variant="default"
              onClick={() => {
                toggleDialog("restaurant", true);
              }}
            >
              <PlusIcon className="h-5 w-5" />
              <span className="text-[16px]">{t("Workers.page.create")}</span>
            </Button>
          </div>
        </header>
        {/* <Separator /> */}
        <DataTable
          className="h-[75vh] overflow-clip bg-stone-200/30 dark:bg-stone-800/20"
          {...{
            data: restaurants.data?.data,
            columns,
            isLoading: restaurants.isLoading,
            pagination: {
              ...pagination,
              meta: restaurants.data?.meta,
            },
            sorting,
          }}
        />
      </div>
    </>
  );
};
