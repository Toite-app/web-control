"use client";

import { BadgePercentIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DiscountForm, {
  DiscountFormValues,
} from "@/features/discount/discount-form";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export default function DiscountsCreatePageContent() {
  const t = useTranslations();
  const handleError = useErrorHandler();

  const onSubmit = async (data: DiscountFormValues) => {
    try {
      // TODO: Implement discount creation
      console.log(data);
    } catch (error) {
      handleError({ error });
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
      <header className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2">
          <BadgePercentIcon className="h-6 w-6" />
          <h1 className="text-4xl font-bold">{t("navbar.discounts-create")}</h1>
        </div>
        <p className="text-stone-500">
          {t("Discounts.create-discount-description")}
        </p>
      </header>

      <div className="mt-8 flex max-w-xl flex-col gap-2">
        <Card className="flex flex-col gap-3 p-4">
          <DiscountForm onSubmit={onSubmit} />
        </Card>
      </div>
    </div>
  );
}
