"use client";
import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IOrderDish } from "@/types/order.types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Settings2Icon } from "lucide-react";
import { markOrderDishAsReadyMutation } from "@/api/fetch/kitchener/dishes/markOrderDishAsReady";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";

export type OrderDishReadyDialogProps = {
  data: {
    orderDish: Pick<
      IOrderDish,
      "id" | "name" | "modifiers" | "orderId" | "quantity" | "isAdditional"
    >;
  };
  open?: boolean;
  onClose?: () => void;
};

const OrderDishReadyDialog = (props: OrderDishReadyDialogProps) => {
  const { data, open, onClose } = props;
  const { orderDish } = data;

  const t = useTranslations();
  const handleError = useErrorHandler();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await markOrderDishAsReadyMutation({
        urlValues: {
          orderId: orderDish.orderId,
          orderDishId: orderDish.id,
        },
      });

      toast({
        title: t("OrderDishReadyDialog.dialog.success"),
        description: t("OrderDishReadyDialog.dialog.success-description"),
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
          <DialogTitle>{t("OrderDishReadyDialog.dialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-0">
          <p className="text-sm text-muted-foreground">
            {t("OrderDishReadyDialog.dialog.description")}
          </p>
          <div className="flex flex-col rounded-md border border-solid border-purple-500 px-2 py-1">
            {orderDish.isAdditional && (
              <span className="text-xs text-primary">
                {t("KitchenerOrderCard.additional")}
              </span>
            )}
            <div className="flex flex-row items-center gap-1">
              <p className="text-xl font-bold text-stone-700 dark:text-stone-200">
                <span
                  className={cn("text-primary text-purple-500")}
                >{`x${orderDish.quantity} `}</span>
                {orderDish.name}
              </p>
            </div>
            {orderDish.modifiers.length > 0 && (
              <div className="flex flex-row items-center gap-1">
                <Settings2Icon className="h-4 w-4 text-red-500" />
                <span className="text-base font-semibold text-red-500">
                  {orderDish.modifiers.map((m) => m.name).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button onClick={handleSubmit}>
          {t("OrderDishReadyDialog.dialog.submit")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default memo(OrderDishReadyDialog);
