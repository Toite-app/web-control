"use client";

import { useGetWorkshifts } from "@/api/fetch/workshifts/useGetWorkshifts";
import { DataTable } from "@/components/data-table";
import { usePagination } from "@/components/data-table/hooks/usePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useWorkshiftsTableColumns from "@/features/workshifts/data-table/hooks/useColumns";
import useDialogsStore from "@/store/dialogs-store";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WorkshiftsContent() {
  const t = useTranslations();

  const toggleDialog = useDialogsStore((state) => state.toggle);

  const pagination = usePagination();
  const columns = useWorkshiftsTableColumns();

  const workshifts = useGetWorkshifts({
    params: {
      page: pagination.state.pageIndex + 1,
      size: pagination.state.pageSize,
    },
  });

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4">
              <h1 className=" text-4xl font-bold">{t("navbar.workshifts")}</h1>
              {workshifts.data?.meta.total && (
                <Badge className="rounded-lg" variant="default">
                  {workshifts.data?.meta.total || "-"}
                </Badge>
              )}
            </div>
            <p className="text-stone-500">{t("workshifts.description")}</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            {/* <Input
    className="w-64 "
    placeholder={t("searchbar")}
    type="search"
  /> */}
            <Button
              className="flex flex-row items-center gap-2"
              variant="default"
              onClick={() => {
                // toggleDialog("restaurant", true);
              }}
            >
              <PlusIcon className="h-5 w-5" />
              <span className="text-[16px]">{t("workshifts.create")}</span>
            </Button>
          </div>
        </header>
        {/* <Separator /> */}
        <DataTable
          className="h-[75vh] overflow-clip bg-stone-200/30 dark:bg-stone-800/20"
          {...{
            data: workshifts.data?.data,
            columns,
            isLoading: workshifts.isLoading,
            pagination: {
              ...pagination,
              meta: workshifts.data?.meta,
            },
            // sorting: sorting,
          }}
        />
      </div>
    </>
  );
}
