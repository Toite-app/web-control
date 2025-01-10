"use client";
import { Card } from "@/components/ui/card";
import { useGetDishCategories } from "@/api/fetch/dish-categories/useGetDishCategories";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { IDishCategory } from "@/types/dish-category.types";
import useDialogsStore from "@/store/dialogs-store";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  className?: string;
};

export default function DishCategoriesList(props: Props) {
  const { className } = props;

  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const { data, isLoading } = useGetDishCategories({
    params: {
      size: 100,
    },
  });

  return (
    <Card className={cn("flex w-full flex-col gap-2 p-4", className)}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg font-bold">{t("DishCategories.title")}</p>
        </div>
        <Button
          size="icon-sm"
          variant="default"
          onClick={() => {
            toggleDialog("dishCategory", true);
          }}
        >
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">
              {t("table.loading")}
            </p>
          </div>
        ) : !data?.data?.length ? (
          <div className="flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">
              {t("table.no-rows")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 p-1">
            {data.data.map((category: IDishCategory) => (
              <button
                key={category.id}
                className="w-full rounded-md px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
