"use client";

import { Button } from "@/components/ui/button";
import { useGetRestaurant } from "@/features/restaurant/api/useGetRestaurant";
import { MapPinIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import RestaurantHoursTab from "@/features/restaurant/hours-tab";
import useDialogsStore from "@/store/dialogs-store";

type Props = {
  restaurantId: string;
};

type TabValue = "hours" | "workshops" | "workers" | "statistics";

export const RestaurantPageContent = (props: Props) => {
  const { restaurantId } = props;

  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const [activeTab, setActiveTab] = useQueryState<TabValue>("tab", {
    defaultValue: "hours",
    parse: (value): TabValue => {
      const validTabs: TabValue[] = [
        "hours",
        "workshops",
        "workers",
        "statistics",
      ];
      return validTabs.includes(value as TabValue)
        ? (value as TabValue)
        : "hours";
    },
  });

  const { data } = useGetRestaurant({
    urlValues: {
      restaurantId,
    },
    skip: !restaurantId,
  });

  return (
    <>
      <div>
        <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
          <header className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-4">
                <h1 className="text-4xl font-bold">{data?.name}</h1>
              </div>
              <div className="flex flex-row items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-stone-500" />
                <p className="text-stone-500">{data?.address}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              <Button
                className="flex flex-row items-center gap-2"
                variant="default"
                onClick={() => {
                  toggleDialog("restaurant", true, data);
                }}
              >
                <PencilIcon className="h-5 w-5" />
                <span className="text-[16px]">{t("Workers.page.edit")}</span>
              </Button>
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
                <TabsTrigger value="hours">
                  {t("Restaurants.tabs.working-hours")}
                </TabsTrigger>
                <TabsTrigger value="workshops">
                  {t("Restaurants.tabs.departments")}
                </TabsTrigger>
                <TabsTrigger value="workers">
                  {t("Restaurants.tabs.staff")}
                </TabsTrigger>
                <TabsTrigger value="statistics">
                  {t("Restaurants.tabs.statistics")}
                </TabsTrigger>
              </TabsList>
              {activeTab === "hours" && (
                <Button
                  variant="default"
                  onClick={() =>
                    toggleDialog("restaurantHour", true, {
                      restaurantId,
                    })
                  }
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="ml-2 text-[14px]">
                    {t("RestaurantHours.dialog.create-title")}
                  </span>
                </Button>
              )}
            </div>

            <TabsContent value="hours">
              <RestaurantHoursTab restaurant={data} />
            </TabsContent>
            <TabsContent value="workshops">
              {/* Departments content will go here */}
            </TabsContent>
            <TabsContent value="workers">
              {/* Staff content will go here */}
            </TabsContent>
            <TabsContent value="statistics">
              {/* Statistics content will go here */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};
