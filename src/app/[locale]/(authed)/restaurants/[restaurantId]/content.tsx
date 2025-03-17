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
import RestaurantWorkshopsTab from "@/features/restaurant/workshops-tab";
import RestaurantWorkersTab from "@/features/restaurant/workers-tab";
import RestaurantPaymentMethodsTab from "@/features/restaurant/payment-methods-tab";
import RestaurantDishModifiersTab from "@/features/restaurant/dish-modifiers-tab";
import RestaurantReferencesBookTab from "@/features/restaurant/references-book-tab";

type Props = {
  restaurantId: string;
};

type TabValue =
  | "hours"
  | "workshops"
  | "workers"
  | "statistics"
  | "payment-methods"
  | "dish-modifiers"
  | "references-book";

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
        "payment-methods",
        "dish-modifiers",
        "references-book",
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
                <TabsTrigger value="references-book">
                  {t("Restaurants.tabs.references-book")}
                </TabsTrigger>
                <TabsTrigger value="workers">
                  {t("Restaurants.tabs.staff")}
                </TabsTrigger>
                <TabsTrigger value="payment-methods">
                  {t("Restaurants.tabs.payment-methods")}
                </TabsTrigger>
                <TabsTrigger value="dish-modifiers">
                  {t("Restaurants.tabs.dish-modifiers")}
                </TabsTrigger>
                <TabsTrigger value="statistics" disabled>
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
              {activeTab === "workshops" && (
                <Button
                  variant="default"
                  onClick={() =>
                    toggleDialog("restaurantWorkshop", true, {
                      restaurantId,
                    })
                  }
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="ml-2 text-[14px]">
                    {t("RestaurantWorkshops.dialog.create-title")}
                  </span>
                </Button>
              )}
              {activeTab === "payment-methods" && (
                <Button
                  variant="default"
                  onClick={() =>
                    toggleDialog("restaurantPaymentMethod", true, {
                      restaurantId,
                    })
                  }
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="ml-2 text-[14px]">
                    {t("RestaurantPaymentMethods.dialog.create-title")}
                  </span>
                </Button>
              )}
              {activeTab === "dish-modifiers" && (
                <Button
                  variant="default"
                  onClick={() =>
                    toggleDialog("restaurantDishModifier", true, {
                      restaurantId,
                    })
                  }
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="ml-2 text-[14px]">
                    {t("RestaurantDishModifiers.dialog.create-title")}
                  </span>
                </Button>
              )}
            </div>

            <TabsContent value="hours">
              <RestaurantHoursTab restaurant={data} />
            </TabsContent>
            <TabsContent value="workshops">
              <RestaurantWorkshopsTab restaurant={data} />
            </TabsContent>
            <TabsContent value="references-book">
              <RestaurantReferencesBookTab restaurant={data} />
            </TabsContent>
            <TabsContent value="workers">
              <RestaurantWorkersTab restaurant={data} />
            </TabsContent>
            <TabsContent value="payment-methods">
              <RestaurantPaymentMethodsTab restaurant={data} />
            </TabsContent>
            <TabsContent value="dish-modifiers">
              <RestaurantDishModifiersTab restaurant={data} />
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
