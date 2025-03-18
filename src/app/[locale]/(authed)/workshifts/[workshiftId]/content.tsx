"use client";

import { useGetWorkshift } from "@/api/fetch/workshifts/useGetWorkshift";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WorkshiftNavigation from "@/features/workshift/navigation";
import useDialogsStore, { DialogType } from "@/store/dialogs-store";
import format from "@/utils/date-fns";
import { XCircleIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  workshiftId: string;
};

export default function WorkshiftPageContent(props: Props) {
  const { workshiftId } = props;

  const t = useTranslations();
  const locale = useLocale();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const workshift = useGetWorkshift({
    urlValues: {
      workshiftId,
    },
  });

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col gap-4 p-4 py-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-4">
                <h1 className="text-4xl font-bold">
                  {`${t("navbar.workshift")}`}
                </h1>
              </div>
              <p className="text-stone-500">
                {workshift.data?.restaurant.name}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              {workshift.data?.openedAt && (
                <Badge className="rounded-lg px-4 py-2" variant="default">
                  {t("workshifts.opened-at", {
                    openedAt: format(
                      new Date(workshift.data.openedAt),
                      "dd.MM.yyyy HH:mm, EEEE",
                      locale
                    ),
                  })}
                </Badge>
              )}
              {workshift.data?.closedAt && (
                <Badge className="rounded-lg px-4 py-2" variant="destructive">
                  {t("workshifts.closed-at", {
                    closedAt: format(
                      new Date(workshift.data.closedAt),
                      "dd.MM.yyyy HH:mm, EEEE",
                      locale
                    ),
                  })}
                </Badge>
              )}
              {!!workshift.data?.openedAt && !workshift.data?.closedAt && (
                <Button
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!workshift.data) return;

                    toggleDialog(DialogType.CloseWorkshift, true, {
                      workshift: workshift.data,
                    });
                  }}
                >
                  <XCircleIcon className="mr-2 h-5 w-5" />
                  {t("workshifts.close-workshift")}
                </Button>
              )}
            </div>
          </div>
        </header>
        <WorkshiftNavigation workshiftId={workshiftId} />
      </div>
    </>
  );
}
