"use client";

import { Button } from "@/components/ui/button";
import DishCategoriesList from "@/features/dish-categories/list";
import useDialogsStore from "@/store/dialogs-store";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DishesPageContent() {
  const t = useTranslations();

  const toggleDialog = useDialogsStore((state) => state.toggle);

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-screen-2xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4">
              <h1 className="text-4xl font-bold">{t("navbar.dishes")}</h1>
              {/* <Badge className="rounded-lg" variant="default">
                {guests.data?.meta.total || "-"}
              </Badge> */}
            </div>
            <p className="text-stone-500">{t("Dishes.page.description")}</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Button
              className="flex flex-row items-center gap-2"
              variant="default"
              onClick={() => {
                toggleDialog("dish", true);
              }}
            >
              <PlusIcon className="h-5 w-5" />
              <span className="text-[16px]">{t("Dishes.page.create")}</span>
            </Button>
          </div>
        </header>
        <div className="flex flex-row gap-4">
          <DishCategoriesList className="max-h-[80vh] min-h-[80vh] max-w-[300px]" />
        </div>
      </div>
    </>
  );
}
