"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import useDialogsStore, { DialogType } from "@/store/dialogs-store";

const dialogComponents = {
  [DialogType.Restaurant]: dynamic(
    () => import("@/features/restaurants/components/dialog/index"),
    { ssr: false }
  ),
  [DialogType.Worker]: dynamic(
    () => import("@/features/workers/components/dialog/index"),
    { ssr: false }
  ),
  [DialogType.RestaurantHour]: dynamic(
    () => import("@/features/restaurant/hour-dialog/index"),
    { ssr: false }
  ),
  [DialogType.RestaurantWorkshop]: dynamic(
    () => import("@/features/restaurant/workshop-dialog/index"),
    { ssr: false }
  ),
  [DialogType.RestaurantWorkshopWorkers]: dynamic(
    () => import("@/features/restaurant/workshop-workers-dialog/index"),
    { ssr: false }
  ),
  [DialogType.Guest]: dynamic(
    () => import("@/features/guests/components/dialog/index"),
    { ssr: false }
  ),
  [DialogType.DishCategory]: dynamic(
    () => import("@/features/dish-categories/dialog/index"),
    { ssr: false }
  ),
};

const DialogsPortal = () => {
  const { states, loaded, toggle } = useDialogsStore();

  const openDialogs = useMemo(
    () => states.filter((state) => loaded.has(state.type as DialogType)),
    [states, loaded]
  );

  return (
    <>
      {openDialogs.map(({ type, isOpen, data }) => {
        const DialogComponent = dialogComponents?.[type];

        if (!DialogComponent) return null;

        return (
          <DialogComponent
            key={type}
            open={isOpen}
            // @ts-expect-error data thing for dialogs store
            data={data}
            onClose={() => {
              toggle(type, false, undefined);
            }}
          />
        );
      })}
    </>
  );
};

export default DialogsPortal;
