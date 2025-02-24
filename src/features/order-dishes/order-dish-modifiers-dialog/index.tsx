import { memo, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useGetRestaurantDishModifiers } from "@/api/fetch/restaurants/dish-modifiers/useGetRestaurantDishModifiers";
import { updateOrderDishModifiersMutation } from "@/api/fetch/orders/dishes/updateModifiers";
import { IOrderDishModifier } from "@/types/order.types";

export type OrderDishModifiersDialogProps = {
  data: {
    restaurantId?: string | null;
    orderDishId: string;
    orderId: string;
    modifiers: IOrderDishModifier[];
  };
  open?: boolean;
  onClose?: () => void;
};

const OrderDishModifiersDialog = (props: OrderDishModifiersDialogProps) => {
  const { data, open, onClose } = props;
  const { restaurantId, orderDishId, orderId, modifiers } = data;

  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);

  const { data: availableModifiers, isLoading: isLoadingModifiers } =
    useGetRestaurantDishModifiers({
      urlValues: {
        restaurantId: restaurantId ?? "",
      },
      skip: !restaurantId || !open,
    });

  useEffect(() => {
    if (open && modifiers) {
      setSelectedModifiers(modifiers.map((modifier) => modifier.id));
    }
  }, [open, modifiers]);

  const handleSubmit = async () => {
    try {
      await updateOrderDishModifiersMutation({
        urlValues: {
          orderId,
          orderDishId,
        },
        data: {
          dishModifierIds: selectedModifiers,
        },
      });

      toast({
        title: t("OrderDishModifiers.dialog.success"),
        description: t("OrderDishModifiers.dialog.success-description"),
        variant: "success",
      });

      onClose?.();
    } catch (error) {
      handleError({ error });
    }
  };

  const isLoaderVisible = isLoadingModifiers;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && onClose) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("OrderDishModifiers.dialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {!restaurantId ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border p-4">
              <p className="text-center text-sm text-muted-foreground">
                {t("OrderDishModifiers.dialog.no-restaurant")}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {t("OrderDishModifiers.dialog.description")}
              </p>
              <ScrollArea className="h-[300px] rounded-md border p-4">
                {isLoaderVisible ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      {t("table.loading")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableModifiers?.map((modifier) => (
                      <div
                        key={modifier.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={modifier.id}
                          checked={selectedModifiers.includes(modifier.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedModifiers((prev) => [
                                ...prev,
                                modifier.id,
                              ]);
                            } else {
                              setSelectedModifiers((prev) =>
                                prev.filter((id) => id !== modifier.id)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={modifier.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {modifier.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!restaurantId}
            className="h-10 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
          >
            {t("OrderDishModifiers.dialog.submit")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(OrderDishModifiersDialog);
