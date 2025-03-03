"use client";

import { useGetDiscounts } from "@/api/fetch/discounts/useGetDiscounts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DiscountCard from "@/features/discount/discount-card";
import { Link } from "@/navigation";
import { IDiscount } from "@/types/discount.types";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DiscountsContent({}) {
  const t = useTranslations();

  const discounts = useGetDiscounts();

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4">
              <h1 className="text-4xl font-bold">{t("navbar.discounts")}</h1>
              {discounts.data?.length && (
                <Badge className="rounded-lg" variant="default">
                  {discounts.data?.length}
                </Badge>
              )}
            </div>
            <p className="text-stone-500">{t("Discounts.page.description")}</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            {/* <Input
              className="w-64 "
              placeholder={t("searchbar")}
              type="search"
            /> */}
            <Link
              href={{
                pathname: "/discounts/create",
              }}
            >
              <Button
                className="flex flex-row items-center gap-2"
                variant="default"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="text-[16px]">
                  {t("Discounts.page.create")}
                </span>
              </Button>
            </Link>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {discounts.data?.map((discount) => (
            <Link
              href={{
                pathname: "/discounts/[discountId]",
                params: {
                  discountId: discount.id,
                },
              }}
              key={discount.id}
            >
              <DiscountCard
                className="cursor-pointer hover:bg-accent"
                discount={discount}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
