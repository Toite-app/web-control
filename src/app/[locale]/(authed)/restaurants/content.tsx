"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetRestaurants } from "@/features/restaurants/api/useGetRestaurants";
import RestaurantDialog from "@/features/restaurants/components/dialog";
export const RestaurantsPageContent = () => {
  const t = useTranslations();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const restaurants = useGetRestaurants();

  console.log(restaurants);

  return (
    <>
      <RestaurantDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4">
              <h1 className=" text-4xl font-bold">{t("navbar.restaurants")}</h1>
              <Badge className="rounded-lg" variant="default">
                {/* {workers.data?.meta.total || "-"} */}
              </Badge>
            </div>
            <p className="text-stone-500">
              {t("Restaurants.page.description")}
            </p>
          </div>
          <div className="flex flex-row items-center gap-4">
            {/* <Input
        className="w-64 "
        placeholder={t("searchbar")}
        type="search"
      /> */}
            <Button
              className="flex flex-row items-center gap-2"
              variant="default"
              onClick={() => {
                setCreateOpen(true);
              }}
            >
              <PlusIcon className="h-5 w-5" />
              <span className="text-[16px]">{t("Workers.page.create")}</span>
            </Button>
            {/* <WorkerDialog open={createOpen} onClose={handleClose} /> */}
          </div>
        </header>
        {/* <Separator /> */}
      </div>
    </>
  );
};
