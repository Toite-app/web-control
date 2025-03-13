"use client";
import { IWorkshift, WorkshiftStatus } from "@/types/workshift.types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru, enUS, et } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Link } from "@/navigation";

export default function useWorkshiftsTableColumns() {
  const locale = useLocale();
  const t = useTranslations();

  return useMemo<ColumnDef<IWorkshift>[]>(
    () => [
      {
        accessorKey: "restaurant.name",
        header: () => {
          return <>{t("workshifts.columns.restaurant")}</>;
        },
      },
      {
        accessorKey: "status",
        header: () => {
          return <>{t("workshifts.columns.status")}</>;
        },
        cell: ({ row }) => {
          return (
            <Badge
              variant={
                row.original.status === WorkshiftStatus.PLANNED
                  ? "outline"
                  : row.original.status === WorkshiftStatus.OPENED
                    ? "success"
                    : "destructive"
              }
            >
              {t(`workshifts.status-enum.${row.original.status}`)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "openedAt",
        header: () => {
          return <>{t("workshifts.columns.openedAt")}</>;
        },
        cell: ({ row }) => (
          <span>
            {row.original.openedAt
              ? format(
                  new Date(row.original.openedAt),
                  "dd.MM.yyyy HH:mm, EEEE",
                  {
                    locale: locale === "ru" ? ru : locale === "en" ? enUS : et,
                  }
                )
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "closedAt",
        header: () => {
          return <>{t("workshifts.columns.closedAt")}</>;
        },
        cell: ({ row }) => (
          <span>
            {row.original.closedAt
              ? format(
                  new Date(row.original.closedAt),
                  "dd.MM.yyyy HH:mm, EEEE",
                  {
                    locale: locale === "ru" ? ru : locale === "en" ? enUS : et,
                  }
                )
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: () => {
          return <>{t("workshifts.columns.createdAt")}</>;
        },
        cell: ({ row }) => (
          <span>
            {format(new Date(row.original.createdAt), "dd.MM.yyyy HH:mm", {
              locale: locale === "ru" ? ru : locale === "en" ? enUS : et,
            })}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row items-center gap-2">
              <Link
                href={{
                  pathname: "/workshifts/[workshiftId]",
                  params: {
                    workshiftId: row.original.id,
                  },
                }}
              >
                <Button
                  className="flex flex-row items-center gap-2"
                  variant="outline"
                  size="sm"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>{t("workshifts.show")}</span>
                </Button>
              </Link>
            </div>
          );
        },
      },
    ],
    [t, locale]
  );
}
