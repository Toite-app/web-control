"use client";

import { Button } from "@/components/ui/button";
import { useGetRestaurant } from "@/features/restaurant/api/useGetRestaurant";
import { MapPinIcon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import RestaurantDialog from "@/features/restaurants/components/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import RestaurantHoursTab from "@/features/restaurant/hours-tab";

type Props = {
  restaurantId: string;
};

type TabValue = "hours" | "workshops" | "workers" | "statistics";

export const RestaurantPageContent = (props: Props) => {
  const { restaurantId } = props;
  const t = useTranslations();
  const [editOpen, setEditOpen] = useState(false);

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

  const { data, isLoading } = useGetRestaurant({
    urlValues: {
      restaurantId,
    },
    skip: !restaurantId,
  });

  return (
    <>
      {!isLoading && (
        <RestaurantDialog
          open={data !== null && editOpen}
          data={data}
          onClose={() => setEditOpen(false)}
        />
      )}
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
                  setEditOpen(true);
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
