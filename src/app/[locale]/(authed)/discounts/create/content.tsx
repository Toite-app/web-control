"use client";

import { BadgePercentIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import DiscountForm, {
  DiscountFormValues,
} from "@/features/discount/discount-form";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { UseFormReturn } from "react-hook-form";
import { createDiscountMutation } from "@/api/fetch/discounts/createDiscount";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DiscountsCreatePageContent() {
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();
  const router = useRouter();

  const onSubmit = async (
    data: DiscountFormValues,
    form: UseFormReturn<DiscountFormValues>
  ) => {
    try {
      const discount = await createDiscountMutation({
        data: {
          ...data,
          guestIds: data.guests.map((guest) => guest.id),
          menus: data.menus.map((menu) => ({
            dishesMenuId: menu.menu.id,
            restaurantIds: menu.selectedRestaurantIds,
            categoryIds: menu.selectedCategoryIds,
          })),
          startTime: data.applyStartAndEndTime ? data.startTime : null,
          endTime: data.applyStartAndEndTime ? data.endTime : null,
          promocode: data.promocode ?? null,
        },
      });

      toast({
        title: t("Discounts.create-discount-success"),
        description: t("Discounts.create-discount-success-description"),
        variant: "success",
      });

      router.push({
        pathname: "/discounts/[discountId]",
        params: { discountId: discount.id },
      });
    } catch (error) {
      handleError({ error, form });
    }
  };

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
              <BreadcrumbPage>{t("navbar.discounts-create")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <header className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-2">
            <BadgePercentIcon className="h-6 w-6" />
            <h1 className="text-4xl font-bold">
              {t("navbar.discounts-create")}
            </h1>
          </div>
          <p className="text-stone-500">
            {t("Discounts.create-discount-description")}
          </p>
        </header>
      </div>

      <div className="mt-8">
        <DiscountForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
