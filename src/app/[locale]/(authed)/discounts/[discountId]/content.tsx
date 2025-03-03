"use client";

import { useGetDiscount } from "@/api/fetch/discounts/useGetDiscount";
import DiscountForm, {
  DiscountFormValues,
} from "@/features/discount/discount-form";
import { BadgePercentIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

export default function DiscountContent({
  discountId,
}: {
  discountId: string;
}) {
  const t = useTranslations();

  const discount = useGetDiscount({
    urlValues: {
      discountId,
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

  const onSubmit = async (
    data: DiscountFormValues,
    form: UseFormReturn<DiscountFormValues>
  ) => {
    console.log(data);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
      <header className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2">
          <BadgePercentIcon className="h-6 w-6" />
          <h1 className="text-4xl font-bold">{t("navbar.discounts-edit")}</h1>
        </div>
        <p className="text-stone-500">
          {t("Discounts.create-discount-description")}
        </p>
      </header>

      <div className="mt-8">
        <DiscountForm initialValues={initialValues} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
