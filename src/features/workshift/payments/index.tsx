"use client";
import { useGetWorkshiftPayments } from "@/api/fetch/workshifts/payments/useGetWorkshiftPayments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CreateWorkshiftPayment from "@/features/workshift/payments/components/CreatePayment";
import PaymentListItem from "@/features/workshift/payments/components/PaymentListItem";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { BanknoteIcon } from "lucide-react";

export type WorkshiftPaymentsProps = {
  className?: string;
  workshiftId: string;
  restaurantId?: string;
  type: "INCOME_AND_CASHLESS" | "EXPENSES";
};

export default function WorkshiftPayments(props: WorkshiftPaymentsProps) {
  const { className, workshiftId, restaurantId, type } = props;

  const t = useTranslations();

  const payments = useGetWorkshiftPayments({
    urlValues: {
      workshiftId,
    },
    params: {
      types:
        type === "INCOME_AND_CASHLESS" ? ["INCOME", "CASHLESS"] : ["EXPENSE"],
    },
    config: {
      keepPreviousData: true,
    },
  });

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="py-4">
        <CardTitle>
          {t(
            `workshift-payments.${type
              .toLowerCase()
              .replaceAll("_", "-")}.title`
          )}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        <CreateWorkshiftPayment
          workshiftId={workshiftId}
          restaurantId={restaurantId}
          type={type}
        />
        <div className="flex flex-col gap-2">
          {payments.data?.length ? (
            payments.data.map((payment, index) => (
              <PaymentListItem
                key={payment.id}
                payment={payment}
                index={index}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
              <BanknoteIcon className="h-12 w-12" />
              <p className="text-lg font-medium">
                {t("workshift-payments.no-payments")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
