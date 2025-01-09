"use client";

import { FC } from "react";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetColumns } from "@/features/guests/components/data-table/hooks/useGetColumns";
import { DataTable } from "@/components/data-table";
import { usePagination } from "@/components/data-table/hooks/usePagination";
import { useSorting } from "@/components/data-table/hooks/useSorting";
import { useFilters } from "@/components/data-table/hooks/useFilters";
import useDialogsStore from "@/store/dialogs-store";
import { useGetGuests } from "@/api/fetch/guests/useGetGuests";

const GuestsPageContent: FC = () => {
  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const columns = useGetColumns({
    onEdit: (guest) => {
      toggleDialog("guest", true, guest);
    },
  });

  const pagination = usePagination();
  const sorting = useSorting();
  const filters = useFilters();
  const guests = useGetGuests({
    params: {
      page: pagination.state.pageIndex + 1,
      size: pagination.state.pageSize,
      ...(sorting.sortBy
        ? {
            sortBy: sorting.sortBy,
            sortOrder: sorting.sortOrder,
          }
        : {}),
      ...filters.filterParams,
    },
    config: {
      refreshInterval: 60_000,
      keepPreviousData: true,
    },
  });

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4">
              <h1 className="text-4xl font-bold">{t("navbar.guests")}</h1>
              <Badge className="rounded-lg" variant="default">
                {guests.data?.meta.total || "-"}
              </Badge>
            </div>
            <p className="text-stone-500">{t("Guests.page.description")}</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Button
              className="flex flex-row items-center gap-2"
              variant="default"
              onClick={() => {
                toggleDialog("guest", true);
              }}
            >
              <PlusIcon className="h-5 w-5" />
              <span className="text-[16px]">{t("Guests.page.create")}</span>
            </Button>
          </div>
        </header>
        <DataTable
          className="h-[75vh] overflow-clip bg-stone-200/30 dark:bg-stone-800/20"
          {...{
            data: guests.data?.data,
            columns,
            isLoading: guests.isLoading,
            pagination: {
              ...pagination,
              meta: guests.data?.meta,
            },
            sorting,
          }}
        />
      </div>
    </>
  );
};

export default GuestsPageContent;
