import { ColumnDef } from "@tanstack/react-table";
import { et } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { format, formatDistance } from "date-fns";
import { ru } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon, UserPlus2 } from "lucide-react";
import { IRestaurantWorkshop } from "@/types/restaurant.types";
import useDialogsStore, { DialogType } from "@/store/dialogs-store";

type Options = {
  onEdit: (workshop: IRestaurantWorkshop) => void;
};

const useRestaurantWorkshopsColumns = (options: Options) => {
  const { onEdit } = options;

  const locale = useLocale();
  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  return useMemo<ColumnDef<IRestaurantWorkshop>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => {
          return <>{t("Restaurants.columns.workshopName")}</>;
        },
      },
      {
        accessorKey: "isLabelPrintingEnabled",
        header: () => {
          return <>{t("Restaurants.columns.isLabelPrintingEnabled")}</>;
        },
        cell: ({ row }) => (
          <Badge
            className="whitespace-nowrap"
            variant={
              row.original.isLabelPrintingEnabled ? "default" : "destructive"
            }
          >
            {row.original.isLabelPrintingEnabled
              ? t("toite.yes")
              : t("toite.no")}
          </Badge>
        ),
      },
      {
        accessorKey: "isEnabled",
        header: () => {
          return <>{t("fields.isEnabled")}</>;
        },
        cell: ({ row }) => (
          <Badge
            className="whitespace-nowrap"
            variant={row.original.isEnabled ? "default" : "secondary"}
          >
            {row.original.isEnabled ? t("toite.enabled") : t("toite.disabled")}
          </Badge>
        ),
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
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="flex flex-row items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  toggleDialog(DialogType.RestaurantWorkshopWorkers, true, {
                    restaurantId: row.original.restaurantId,
                    workshopId: row.original.id,
                  })
                }
              >
                <UserPlus2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onEdit(row.original)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [locale, t, onEdit]
  );
};

export default useRestaurantWorkshopsColumns;
