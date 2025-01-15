"use client";

import { useGetDish } from "@/api/fetch/dishes/useGetDish";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import DishFormTab from "@/features/dish/form-tab";
import { Card } from "@/components/ui/card";
import DishImagesTab from "@/features/dish/images-tab";
type TabValue = "dishForm" | "pricelist" | "images";

type Props = {
  dishId: string;
};

export default function DishPageContent({ dishId }: Props) {
  const t = useTranslations();

  const [activeTab, setActiveTab] = useQueryState<TabValue>("tab", {
    defaultValue: "dishForm",
    parse: (value): TabValue => {
      const validTabs: TabValue[] = ["dishForm", "pricelist", "images"];
      return validTabs.includes(value as TabValue)
        ? (value as TabValue)
        : "dishForm";
    },
  });

  const dish = useGetDish({
    urlValues: {
      dishId,
    },
    config: {
      keepPreviousData: true,
    },
  });

  return (
    <div>
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4">
              <h1 className=" text-4xl font-bold">{dish.data?.name}</h1>
              {/* <Badge className="rounded-lg" variant="default">
                {workers.data?.meta.total || "-"}
              </Badge> */}
            </div>
            {/* <p className="text-stone-500">{t("Workers.page.description")}</p> */}
          </div>
          <div className="flex flex-row items-center gap-4">
            {/* <Input
              className="w-64 "
              placeholder={t("searchbar")}
              type="search"
            /> */}
            {/* <Button
              className="flex flex-row items-center gap-2"
              variant="default"
              onClick={() => {
                toggleDialog("worker", true);
              }}
            >
              <PlusIcon className="h-5 w-5" />
              <span className="text-[16px]">{t("Workers.page.create")}</span>
            </Button> */}
          </div>
        </header>
        <Separator />
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
          className="w-full"
        >
          <div className="flex flex-row items-center justify-between">
            <TabsList className="spacing-2 w-full justify-start">
              <TabsTrigger value="dishForm">
                {t("Dishes.tabs.dishForm")}
              </TabsTrigger>
              <TabsTrigger value="pricelist">
                {t("Dishes.tabs.pricelist")}
              </TabsTrigger>
              <TabsTrigger value="images">
                {t("Dishes.tabs.images")}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="dishForm">
            <Card>
              <DishFormTab data={dish.data} />
            </Card>
          </TabsContent>
          <TabsContent value="images">
            <DishImagesTab data={dish.data} />
          </TabsContent>

          {/* <TabsContent value="hours">
              <RestaurantHoursTab restaurant={data} />
            </TabsContent>
            <TabsContent value="workshops">
              <RestaurantWorkshopsTab restaurant={data} />
            </TabsContent>
            <TabsContent value="workers">
              <RestaurantWorkersTab restaurant={data} />
            </TabsContent>
            <TabsContent value="statistics">
              {/* Statistics content will go here 
            </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
