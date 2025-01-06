"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { IRestaurant } from "@/types/restaurant.types";
import { SortButton } from "@/components/data-table/components/SortButton";
import { Link } from "@/navigation";

type Options = {
  onEdit: (restaurant: IRestaurant) => void;
};

export const useGetColumns = (options: Options) => {
  const { onEdit } = options;
  const locale = useLocale();
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return useMemo<ColumnDef<IRestaurant>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return <SortButton column={column}>{t("fields.name")}</SortButton>;
        },
        cell: ({ row }) => {
          return (
            <Link
              href={{
                pathname: "/restaurants/[restaurantId]",
                params: { restaurantId: row.original.id },
              }}
            >
              <div className="flex flex-row items-center gap-1 underline">
                <span>{row.original?.name || "-"}</span>
              </div>
            </Link>
          );
        },
      },
      {
        accessorKey: "legalEntity",
        header: ({ column }) => {
          return (
            <SortButton column={column}>{t("fields.legalEntity")}</SortButton>
          );
        },
      },
      {
        accessorKey: "address",
        header: ({ column }) => {
          return <SortButton column={column}>{t("fields.address")}</SortButton>;
        },
      },
      {
        accessorKey: "isEnabled",
        header: ({ column }) => {
          return (
            <SortButton column={column}>{t("fields.isEnabled")}</SortButton>
          );
        },
        cell: ({ row }) => (
          <Badge
            className="whitespace-nowrap"
            variant={
              row.original.isEnabled && !row.original.isClosedForever
                ? "default"
                : "secondary"
            }
          >
            {row.original.isEnabled && !row.original.isClosedForever
              ? t("toite.enabled")
              : t("toite.disabled")}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <SortButton column={column}>{t("fields.createdAt")}</SortButton>
          );
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
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit(row.original);
                  }}
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
