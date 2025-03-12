import { memo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useForm } from "react-hook-form";
import { returnOrderDishMutation } from "@/api/fetch/orders/dishes/returnOrderDish";
import { IOrderDish } from "@/types/order.types";
import { cn } from "@/lib/utils";
import { Settings2Icon } from "lucide-react";

export type OrderDishReturnmentDialogProps = {
  data: {
    orderDish: Pick<
      IOrderDish,
      "id" | "name" | "modifiers" | "orderId" | "quantity" | "isAdditional"
    >;
  };
  open?: boolean;
  onClose?: () => void;
};

type FormValues = {
  reason: string;
  customReason: string;
  quantity: number;
};

const RETURN_REASONS = {
  KITCHENER_ERROR: "kitchener-error",
  WAITER_ERROR: "waiter-error",
  LONG_WAITING: "long-waiting",
  OTHER: "other",
} as const;

const OrderDishReturnmentDialog = (props: OrderDishReturnmentDialogProps) => {
  const { data, open, onClose } = props;
  const { orderDish } = data;

  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const form = useForm<FormValues>({
    defaultValues: {
      reason: "",
      customReason: "",
      quantity: orderDish.quantity,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = form;

  const selectedReason = watch("reason");
  const customReason = watch("customReason");
  const quantity = watch("quantity");

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset({
        reason: "",
        customReason: "",
        quantity: orderDish.quantity,
      });
    }
  }, [open, reset, orderDish.quantity]);

  const isSubmitDisabled =
    !selectedReason ||
    (selectedReason === RETURN_REASONS.OTHER && !customReason.trim()) ||
    !quantity ||
    quantity < 1 ||
    quantity > orderDish.quantity;

  const onSubmit = async (values: FormValues) => {
    try {
      const reason =
        values.reason === RETURN_REASONS.OTHER
          ? values.customReason
          : t(
              `OrderDishReturnmentDialog.dialog.reason.options.${values.reason}`
            );

      await returnOrderDishMutation({
        urlValues: {
          orderId: orderDish.orderId,
          orderDishId: orderDish.id,
        },
        data: {
          quantity: values.quantity,
          reason,
        },
      });

      toast({
        title: t("OrderDishReturnmentDialog.dialog.success"),
        description: t("OrderDishReturnmentDialog.dialog.success-description"),
        variant: "success",
      });

      onClose?.();
    } catch (error) {
      handleError({ error, form });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && onClose) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t("OrderDishReturnmentDialog.dialog.title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2 py-0">
            <p className="text-sm text-muted-foreground">
              {t("OrderDishReturnmentDialog.dialog.description")}
            </p>
            <div className="flex flex-col rounded-md border border-solid border-purple-500 px-2 py-1">
              {orderDish.isAdditional && (
                <span className="text-xs text-primary">
                  {t("KitchenerOrderCard.additional")}
                </span>
              )}
              <div className="flex flex-row items-center gap-1">
                <p className="text-xl font-bold text-stone-700 dark:text-stone-200">
                  <span className={cn("text-primary text-purple-500")}>
                    {`x${orderDish.quantity} `}
                  </span>
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

          <div className="space-y-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                {t("OrderDishReturnmentDialog.dialog.quantity.label")}
              </label>
              <Input
                type="number"
                min={1}
                max={orderDish.quantity}
                {...register("quantity", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    const value = parseInt(e.target.value);
                    if (value > orderDish.quantity) {
                      setValue("quantity", orderDish.quantity);
                    } else if (value < 1) {
                      setValue("quantity", 1);
                    }
                  },
                })}
                placeholder={t(
                  "OrderDishReturnmentDialog.dialog.quantity.placeholder"
                )}
              />
              <p className="text-xs text-muted-foreground">
                {t("OrderDishReturnmentDialog.dialog.quantity.description", {
                  max: orderDish.quantity,
                })}
              </p>
            </div>

            <Select
              onValueChange={(value) => setValue("reason", value)}
              value={selectedReason}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    "OrderDishReturnmentDialog.dialog.reason.placeholder"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RETURN_REASONS).map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {t(
                      `OrderDishReturnmentDialog.dialog.reason.options.${reason}`
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedReason === RETURN_REASONS.OTHER && (
              <Input
                {...register("customReason")}
                placeholder={t(
                  "OrderDishReturnmentDialog.dialog.reason.custom-placeholder"
                )}
              />
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
            {t("OrderDishReturnmentDialog.dialog.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(OrderDishReturnmentDialog);
