"use client";

import { FC } from "react";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MessageCategories } from "@/messages/index.types";
import { useGetWorkers } from "@/features/workers/api/useGetWorkers";
import { WorkersDataTable } from "@/features/workers/data-table";

export const WorkersPageContent: FC = () => {
  const tNav = useTranslations(MessageCategories.NAVBAR);
  const t = useTranslations(MessageCategories.WORKERS_PAGE);

  const { data, isLoading } = useGetWorkers();

  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
      <header className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-4">
            <h1 className=" text-4xl font-bold">{tNav("workers")}</h1>
            <Badge className="rounded-lg" variant="default">
              {data?.meta.total || "-"}
            </Badge>
          </div>
          <p className="text-stone-500">{t("description")}</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Input className="w-64 " placeholder={t("searchbar")} type="search" />
          <Button variant="default" size="icon">
            <PlusIcon />
          </Button>
        </div>
      </header>
      <Separator />
      <WorkersDataTable
        className="h-[75vh] overflow-clip bg-stone-200/30 dark:bg-stone-800/20"
        data={data?.data}
      />
    </div>
  );
};
