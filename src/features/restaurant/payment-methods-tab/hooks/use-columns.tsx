import { ColumnDef } from "@tanstack/react-table";
import { et } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { format, formatDistance } from "date-fns";
import { ru } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { IPaymentMethod } from "@/types/payment-method.types";

type Options = {
  onEdit: (method: IPaymentMethod) => void;
};

const usePaymentMethodsColumns = (options: Options) => {
  const { onEdit } = options;
  const locale = useLocale();
  const t = useTranslations();

  return useMemo<ColumnDef<IPaymentMethod>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <>{t("PaymentMethods.columns.name")}</>,
        cell: ({ row }) => <>{row.original.name}</>,
      },
      {
        accessorKey: "type",
        header: () => <>{t("PaymentMethods.columns.type")}</>,
        cell: ({ row }) => <>{row.original.type}</>,
      },
      {
        accessorKey: "secretId",
        accessorFn: (row) => row.secretId ?? "-",
        header: () => <>{t("PaymentMethods.columns.secretId")}</>,
      },
      {
        accessorKey: "isActive",
        header: () => <>{t("fields.isEnabled")}</>,
        cell: ({ row }) => (
          <Badge
            className="whitespace-nowrap"
            variant={row.original.isActive ? "default" : "secondary"}
          >
            {row.original.isActive ? t("toite.enabled") : t("toite.disabled")}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: () => <>{t("fields.createdAt")}</>,
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
        header: () => <>{t("fields.updatedAt")}</>,
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

export default usePaymentMethodsColumns;
