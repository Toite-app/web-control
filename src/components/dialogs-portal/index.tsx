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
        console.log("isOpen", isOpen, data);

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
