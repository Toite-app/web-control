"use client";

import { updateDiscountMutation } from "@/api/fetch/discounts/updateDiscount";
import { useGetDiscount } from "@/api/fetch/discounts/useGetDiscount";
import DiscountForm, {
  DiscountFormValues,
} from "@/features/discount/discount-form";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { BadgePercentIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DiscountContent({
  discountId,
}: {
  discountId: string;
}) {
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const discount = useGetDiscount({
    urlValues: {
      discountId,
    },
    config: {
      keepPreviousData: true,
    },
  });

  const initialValues = useMemo(() => {
    return {
      ...discount.data,
      restaurantIds: (discount.data?.restaurants ?? []).map((restaurant) =>
        String(restaurant.restaurantId)
      ),
    } satisfies Partial<DiscountFormValues>;
  }, [discount.data]);

  const onSubmit = useCallback(
    async (
      data: DiscountFormValues,
      form: UseFormReturn<DiscountFormValues>
    ) => {
      try {
        await updateDiscountMutation({
          urlValues: {
            discountId,
          },
          data: {
            ...data,
            startHour: null,
            endHour: null,
            promocode: data.promocode ?? null,
          },
        });

        toast({
          title: t("Discounts.update-discount-success"),
          description: t("Discounts.update-discount-success-description"),
          variant: "success",
        });
      } catch (error) {
        handleError({ error, form });
      }
    },
    [discountId, t, toast, handleError]
  );

  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/discounts">
                {t("navbar.discounts")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("navbar.discounts-edit")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <header className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <BadgePercentIcon className="h-6 w-6" />
            <h1 className="text-4xl font-bold">{t("navbar.discounts-edit")}</h1>
          </div>
          <p className="text-stone-500">
            {t("Discounts.create-discount-description")}
          </p>
        </header>
      </div>

      <div className="mt-8">
        <DiscountForm initialValues={initialValues} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
