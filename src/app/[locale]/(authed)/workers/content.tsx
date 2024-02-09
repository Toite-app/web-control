"use client";

import { FC, useCallback, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MessageCategories } from "@/messages/index.types";
import { useGetWorkers } from "@/features/workers/api/useGetWorkers";
import { useGetColumns } from "@/features/workers/components/data-table/hooks/useGetColumns";
import { DataTable } from "@/components/data-table";
import { usePagination } from "@/components/data-table/hooks/usePagination";
import WorkerDialog from "@/features/workers/components/dialog";
import { IWorker } from "@/types/worker.types";

export const WorkersPageContent: FC = () => {
  const tNav = useTranslations(MessageCategories.NAVBAR);
  const t = useTranslations(MessageCategories.WORKERS_PAGE);

  const [worker, setWorker] = useState<IWorker>();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const columns = useGetColumns({
    onEdit: (worker) => {
      setWorker(worker);
      setEditOpen(true);
    },
  });

  const pagination = usePagination();
  const workers = useGetWorkers({
    params: {
      page: pagination.state.pageIndex + 1,
      size: pagination.state.pageSize,
    },
    config: {
      refreshInterval: 60_000,
      keepPreviousData: true,
    },
  });

  const handleClose = useCallback(() => {
    setCreateOpen(false);
    setEditOpen(false);
  }, []);

  return (
    <>
      <WorkerDialog
        open={worker && editOpen}
        data={worker}
        onClose={handleClose}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4">
              <h1 className=" text-4xl font-bold">{tNav("workers")}</h1>
              <Badge className="rounded-lg" variant="default">
                {workers.data?.meta.total || "-"}
              </Badge>
            </div>
            <p className="text-stone-500">{t("description")}</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Input
              className="w-64 "
              placeholder={t("searchbar")}
              type="search"
            />
            <Button
              variant="default"
              size="icon"
              onClick={() => {
                setCreateOpen(true);
              }}
            >
              <PlusIcon />
            </Button>
            <WorkerDialog open={createOpen} onClose={handleClose} />
          </div>
        </header>
        <Separator />
        <DataTable
          className="h-[75vh] overflow-clip bg-stone-200/30 dark:bg-stone-800/20"
          {...{
            data: workers.data?.data,
            columns,
            isLoading: workers.isLoading,
            pagination: {
              state: pagination.state,
              meta: workers.data?.meta,
              onChange: pagination.onChange,
            },
          }}
        />
      </div>
    </>
  );
};
