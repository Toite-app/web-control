"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale, useTranslations } from "next-intl";
import { FC, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { closeWorkshiftMutation } from "@/api/fetch/workshifts/closeWorkshift";
import { IWorkshift } from "@/types/workshift.types";
import { format } from "date-fns";
import { ru, enUS, et } from "date-fns/locale";

export type CloseWorkshiftDialogProps = {
  data?: {
    workshift: IWorkshift;
  };
  open?: boolean;
  onClose?: () => void;
};

const CloseWorkshiftDialog: FC<CloseWorkshiftDialogProps> = (props) => {
  const { data, open, onClose } = props;

  const t = useTranslations();
  const handleError = useErrorHandler();
  const locale = useLocale();
  const { toast } = useToast();

  const handleClose = async () => {
    if (!data?.workshift) return;

    try {
      await closeWorkshiftMutation({
        urlValues: {
          workshiftId: data.workshift.id,
        },
      });

      toast({
        title: t("workshifts.dialog.close-success"),
        description: t("workshifts.dialog.close-success-description"),
        variant: "success",
      });

      onClose?.();
    } catch (error) {
      handleError({ error });
    }
  };

  // Format the opened date for display using date-fns
  const formattedOpenedAt = data?.workshift?.openedAt
    ? format(new Date(data.workshift.openedAt), "d MMMM yyyy, HH:mm", {
        locale: locale === "ru" ? ru : locale === "en" ? enUS : et,
      })
    : "";

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && onClose) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{t("workshifts.dialog.close-title")}</DialogTitle>
          {data?.workshift && (
            <DialogDescription>
              {t("workshifts.dialog.close-description", {
                restaurantName: data.workshift.restaurant.name,
                openedAt: formattedOpenedAt,
              })}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-row items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("toite.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleClose}>
            {t("workshifts.dialog.close-submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(CloseWorkshiftDialog);
