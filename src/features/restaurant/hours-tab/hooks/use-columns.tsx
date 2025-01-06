import { IRestaurantHours } from "@/types/restaurant.types";
import { ColumnDef } from "@tanstack/react-table";
import { et } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { format, formatDistance } from "date-fns";
import { ru } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

const useRestaurantHoursColumns = () => {
  const locale = useLocale();
  const t = useTranslations();

  return useMemo<ColumnDef<IRestaurantHours>[]>(
    () => [
      {
        accessorKey: "dayOfWeek",
        header: () => {
          return <>{t("Restaurants.columns.dayOfWeek")}</>;
        },
        cell: ({ row }) => {
          return <>{t(`dayOfWeek.${row.original.dayOfWeek}`)}</>;
        },
      },
      {
        accessorKey: "openingTime",
        header: () => {
          return <>{t("Restaurants.columns.openingTime")}</>;
        },
      },
      {
        accessorKey: "closingTime",
        header: () => {
          return <>{t("Restaurants.columns.closingTime")}</>;
        },
      },
      {
        accessorKey: "createdAt",
        header: () => {
          return <>{t("fields.createdAt")}</>;
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
        header: () => {
          return <>{t("fields.updatedAt")}</>;
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
    ],
    [locale, t]
  );
};

export default useRestaurantHoursColumns;
