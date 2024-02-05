"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Worker } from "../../api/useGetWorkers";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import format from "date-fns/format";

export const useGetColumns = () => {
  const t = useTranslations();

  return useMemo<ColumnDef<Worker>[]>(
    () => [
      {
        accessorKey: "login",
        header: t("fields.login"),
      },
      {
        accessorKey: "name",
        header: t("fields.name"),
        cell: ({ row }) => <span>{row.original?.name || "-"}</span>,
      },
      {
        accessorKey: "role",
        header: t("fields.role"),
        cell: ({ row }) => <span>{t(`roles.${row.original.role}`)}</span>,
      },
      {
        accessorKey: "createdAt",
        header: t("fields.createdAt"),
        cell: ({ row }) => (
          <span>
            {format(new Date(row.original.createdAt), "dd.MM.yyyy HH:mm:ss")}
          </span>
        ),
      },
    ],
    [t]
  );
};
