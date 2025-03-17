import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { IWorkshiftPaymentCategory } from "@/types/restaurant.types";
import { deleteRestaurantWorkshiftPaymentCategoryMutation } from "@/api/fetch/restaurants/workshift-payment-categories/deletePaymentCategory";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";

export type DeleteWorkshiftPaymentCategoryDialogProps = {
  data: {
    category: IWorkshiftPaymentCategory;
  };
  open?: boolean;
  onClose?: () => void;
};

const DeleteWorkshiftPaymentCategoryDialog = ({
  data,
  open,
  onClose,
}: DeleteWorkshiftPaymentCategoryDialogProps) => {
  const { category } = data;
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const handleDelete = async () => {
    try {
      await deleteRestaurantWorkshiftPaymentCategoryMutation({
        urlValues: {
          restaurantId: String(category.restaurantId),
          categoryId: category.id,
        },
      });

      toast({
        title: t("PaymentCategories.dialog.delete-success"),
        description: t("PaymentCategories.dialog.delete-success-description"),
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("PaymentCategories.dialog.delete-title")}
          </DialogTitle>
          <DialogDescription>
            {t("PaymentCategories.dialog.delete-description", {
              name: category.name,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {t("common.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(DeleteWorkshiftPaymentCategoryDialog);
