"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { IDishesMenu } from "@/types/dishes-menu.types";
import { deleteDishesMenuMutation } from "@/api/fetch/dishes-menus/deleteDishesMenu";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export interface DeleteDishesMenuDialogProps {
  data: {
    dishesMenu: Pick<IDishesMenu, "id" | "name">;
  };
  open?: boolean;
  onClose?: () => void;
}

export default function DeleteDishesMenuDialog({
  data: { dishesMenu },
  open,
  onClose,
}: DeleteDishesMenuDialogProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const handleDelete = async () => {
    try {
      await deleteDishesMenuMutation({
        urlValues: {
          dishesMenuId: dishesMenu.id,
        },
      });

      toast({
        title: t("DishesMenuDialog.delete-success"),
        description: t("DishesMenuDialog.delete-success-description"),
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
        if (!value) onClose?.();
      }}
    >
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{t("DishesMenuDialog.delete-title")}</DialogTitle>
          <DialogDescription>
            {t("DishesMenuDialog.delete-description", {
              name: dishesMenu.name,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("DishesMenuDialog.delete-cancel")}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {t("DishesMenuDialog.delete-confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
