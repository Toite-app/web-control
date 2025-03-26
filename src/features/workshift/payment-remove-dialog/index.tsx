"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { IWorkshiftPayment } from "@/types/workshift-payment.types";
import { removeWorkshiftPaymentMutation } from "@/api/fetch/workshifts/payments/removeWorkshiftPayment";

export type PaymentRemoveDialogProps = {
  data: {
    workshiftId: string;
    payment: IWorkshiftPayment;
  };
  open?: boolean;
  onClose?: () => void;
};

const PaymentRemoveDialog = (props: PaymentRemoveDialogProps) => {
  const { data, open, onClose } = props;
  const { payment, workshiftId } = data;

  const t = useTranslations("workshift-payments");
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const handleRemove = async () => {
    try {
      await removeWorkshiftPaymentMutation({
        urlValues: {
          workshiftId,
          paymentId: payment.id,
        },
      });

      toast({
        title: t("remove-dialog.success"),
        description: t("remove-dialog.success-description"),
        variant: "success",
      });

      onClose?.();
    } catch (error) {
      handleError({ error });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && onClose) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("remove-dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("remove-dialog.description", {
              amount: payment.amount,
              currency: payment.currency,
              categoryName:
                payment.category.parent?.name ?? payment.category.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("remove-dialog.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleRemove}>
            {t("remove-dialog.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(PaymentRemoveDialog);
