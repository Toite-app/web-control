"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EditIcon,
  FingerprintIcon,
  HistoryIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { ru, enUS, et } from "date-fns/locale";
import { toast } from "sonner";
import { IWorker } from "@/types/worker.types";
import { SortButton } from "@/components/data-table/components/SortButton";

type Options = {
  onEdit: (worker: IWorker) => void;
};

export const useGetColumns = (options: Options) => {
  const { onEdit } = options;

  const locale = useLocale();
  const t = useTranslations();

  return useMemo<ColumnDef<IWorker>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return <SortButton column={column}>{t("fields.name")}</SortButton>;
        },
        cell: ({ row }) => {
          const name = row.original?.name || row.original?.login;

          return (
            <div className="flex flex-row items-center gap-1">
              <Avatar className="mr-4 h-9 w-9">
                <AvatarFallback>
                  <span>{name?.charAt(0).toUpperCase()}</span>
                </AvatarFallback>
              </Avatar>
              <span>{row.original?.name || "-"}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "login",
        header: ({ column }) => {
          return <SortButton column={column}>{t("fields.login")}</SortButton>;
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => {
          return <SortButton column={column}>{t("fields.role")}</SortButton>;
        },
        cell: ({ row }) => <span>{t(`roles.${row.original.role}`)}</span>,
      },
      {
        accessorKey: "onlineAt",
        header: ({ column }) => {
          return (
            <SortButton column={column}>{t("fields.onlineAt")}</SortButton>
          );
        },
        cell: ({ row }) => {
          if (row.original.isBlocked) {
            return <Badge variant="destructive">{t("toite.blocked")}</Badge>;
          }

          const isOnline =
            row.original.onlineAt &&
            Date.now() - new Date(row.original.onlineAt).getTime() <
              1000 * 60 * 5;

          return (
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? t("toite.online") : t("toite.offline")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => {
          return (
            <SortButton column={column}>{t("fields.updatedAt")}</SortButton>
          );
        },
        cell: ({ row }) => (
          <span>
            {formatDistance(new Date(row.original.updatedAt), new Date(), {
              addSuffix: true,
              locale: locale === "ru" ? ru : locale === "en" ? enUS : et,
            })}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">
                    {t("Workers.table.actions.open")}
                  </span>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {t("Workers.table.actions.title")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(row.original.id);
                    toast.success(t("table.copied"), {
                      dismissible: false,
                    });
                  }}
                >
                  <FingerprintIcon className="mr-2 h-4 w-4" />
                  <span>{t("Workers.table.actions.copyId")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onEdit(row.original)}
                >
                  <EditIcon className="mr-2 h-4 w-4" />
                  <span>{t("Workers.table.actions.edit")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <HistoryIcon className="mr-2 h-4 w-4" />
                  <span>{t("Workers.table.actions.edit-history")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t, locale, onEdit]
  );
};
