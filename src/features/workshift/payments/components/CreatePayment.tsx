"use client";

import { useGetRestaurantWorkshiftPaymentCategories } from "@/api/fetch/restaurants/workshift-payment-categories/useGetRestaurantWorkshiftPaymentCategories";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import CategoryCombobox from "./CategoryCombobox";
import {
  ICreateWorkshiftPayment,
  createWorkshiftPaymentMutation,
} from "@/api/fetch/workshifts/payments/createWorkshiftPayment";
import { Button } from "@/components/ui/button";
import {
  DollarSignIcon,
  EuroIcon,
  PlusIcon,
  RussianRubleIcon,
} from "lucide-react";
import { useGetWorkshift } from "@/api/fetch/workshifts/useGetWorkshift";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

type Props = {
  type: "INCOME_AND_CASHLESS" | "EXPENSES";
  workshiftId: string;
  restaurantId?: string;
};

type FormValues = ICreateWorkshiftPayment;

const iconClassName = "";

export default function CreateWorkshiftPayment(props: Props) {
  const { type, workshiftId, restaurantId } = props;

  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const workshift = useGetWorkshift({
    urlValues: {
      workshiftId,
    },
  });

  const currency = workshift.data?.restaurant.currency;

  const form = useForm<FormValues>({
    defaultValues: {
      amount: "",
      categoryId: "",
      note: "",
    },
  });

  const { register, watch, setValue, handleSubmit, formState } = form;

  const paymentCategories = useGetRestaurantWorkshiftPaymentCategories({
    urlValues: {
      restaurantId: restaurantId ?? "",
    },
    skip: !restaurantId,
  });

  const categoryOptions = useMemo(() => {
    return (paymentCategories.data ?? []).filter((c) => {
      if (type === "INCOME_AND_CASHLESS") {
        return c.type === "INCOME" || c.type === "CASHLESS";
      }
      return c.type === "EXPENSE";
    });
  }, [type, paymentCategories.data]);

  const onSubmit = async (data: FormValues) => {
    try {
      await createWorkshiftPaymentMutation({
        urlValues: {
          workshiftId,
        },
        data,
      });

      toast({
        title: t("workshift-payments.create-success"),
        description: t("workshift-payments.create-success-description"),
        variant: "success",
      });

      form.reset();
    } catch (error) {
      handleError({
        error,
        form,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-row items-end gap-3 pt-2"
    >
      <div className="w-full flex-col">
        <Label>{t("workshift-payments.payment-amount")}</Label>
        <div className="relative flex flex-row items-center gap-2">
          <Input
            type="number"
            step={0.01}
            placeholder={t("workshift-payments.payment-amount-placeholder")}
            {...register("amount")}
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <div className="absolute right-3">
            {currency === "RUB" && (
              <RussianRubleIcon className={cn("h-4 w-4", iconClassName)} />
            )}
            {currency === "EUR" && (
              <EuroIcon className={cn("h-4 w-4", iconClassName)} />
            )}
            {currency === "USD" && (
              <DollarSignIcon className={cn("h-4 w-4", iconClassName)} />
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex-col">
        <Label>{t("workshift-payments.payment-category")}</Label>
        <CategoryCombobox
          value={watch("categoryId")}
          onChange={(value) => setValue("categoryId", value)}
          options={categoryOptions}
        />
      </div>
      <div className="w-full flex-col">
        <Label>{t("workshift-payments.comment")}</Label>
        <Input
          placeholder={t("workshift-payments.comment-placeholder")}
          {...register("note")}
        />
      </div>
      <Button
        type="submit"
        variant="default"
        size="icon"
        disabled={formState.isSubmitting}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}
