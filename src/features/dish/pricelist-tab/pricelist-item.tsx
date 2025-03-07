"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CurrencyEnum, ICurrency } from "@/types/general.types";
import {
  IDish,
  IDishPricelistItem,
  IUpdateDishPricelist,
} from "@/types/dish.types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { PlusIcon, SaveIcon, SettingsIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/navigation";
import useDialogsStore from "@/store/dialogs-store";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { updateDishPricelistMutation } from "@/api/fetch/dishes/pricelist/put-dish-pricelist";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

type Props = {
  dish?: IDish;
  item: IDishPricelistItem;
};

export function PricelistItem({ dish, item }: Props) {
  const toggleDialog = useDialogsStore((state) => state.toggle);
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const form = useForm<IUpdateDishPricelist>({
    defaultValues: {
      price: item.price,
      currency: item.currency,
      isInStoplist: item.isInStoplist,
      workshopIds: item.workshops
        .filter((w) => w.isActive)
        .map((w) => w.workshopId),
    },
  });

  const { isDirty } = form.formState;

  const handleCreateWorkshop = () => {
    toggleDialog("restaurantWorkshop", true, {
      restaurantId: item.restaurantId,
    });
  };

  const onSubmit = async (data: IUpdateDishPricelist) => {
    if (!dish?.id) return;

    try {
      await updateDishPricelistMutation({
        urlValues: {
          dishId: dish.id,
          restaurantId: item.restaurantId,
        },
        data,
      });

      toast({
        title: t("Dishes.pricelist.save-success"),
        description: t("Dishes.pricelist.save-success-description"),
        variant: "success",
      });

      form.reset(data);
    } catch (error) {
      handleError({ error, form });
    }
  };

  useEffect(() => {
    form.reset({
      price: item.price,
      currency: item.currency,
      isInStoplist: item.isInStoplist,
      workshopIds: item.workshops
        .filter((w) => w.isActive)
        .map((w) => w.workshopId),
    });
  }, [form, item]);

  return (
    <Card className={cn("p-4", isDirty && "border-primary")}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">{item.restaurantName}</h3>
              {dish && (
                <p className="text-sm text-muted-foreground">{dish.name}</p>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={{
                      pathname: "/restaurants/[restaurantId]",
                      params: {
                        restaurantId: item.restaurantId,
                      },
                    }}
                    target="_blank"
                  >
                    <Button variant="outline" size="icon" type="button">
                      <SettingsIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("Dishes.pricelist.settings")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex w-full items-end gap-4 pr-4">
            <div className="flex-1">
              <Label>{t("Dishes.pricelist.price")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...form.register("price", {
                  valueAsNumber: true,
                  validate: {
                    isPositive: (value) =>
                      value >= 0 || t("Dishes.pricelist.price-positive"),
                    decimals: (value) =>
                      /^\d+(\.\d{0,2})?$/.test(value.toString()) ||
                      t("Dishes.pricelist.price-decimals"),
                  },
                })}
                className="w-full"
              />
            </div>
            <div className="w-32">
              <Label>{t("Dishes.pricelist.currency")}</Label>
              <Select
                value={form.watch("currency")}
                onValueChange={(value) =>
                  form.setValue("currency", value as ICurrency, {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CurrencyEnum).map(([key]) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Checkbox
              id={`stoplist-${item.restaurantId}`}
              checked={form.watch("isInStoplist")}
              onCheckedChange={(checked) =>
                form.setValue("isInStoplist", checked as boolean, {
                  shouldDirty: true,
                })
              }
            />
            <Label htmlFor={`stoplist-${item.restaurantId}`}>
              {t("Dishes.pricelist.stoplist")}
            </Label>
          </div>
        </div>
        <Separator />
        <div className="flex w-full flex-col">
          <div className="flex flex-row justify-between">
            <Label className="mb-4 block font-semibold">
              {t("Dishes.pricelist.workshops")}
            </Label>
            {item.workshops.length > 0 && (
              <Button
                variant="default"
                size="icon-xs"
                onClick={handleCreateWorkshop}
                type="button"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {item.workshops.map((workshop) => (
              <div
                key={workshop.workshopId}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={`workshop-${workshop.workshopId}`}
                  checked={form
                    .watch("workshopIds")
                    ?.includes(workshop.workshopId)}
                  onCheckedChange={(checked) => {
                    const currentIds = form.watch("workshopIds") ?? [];
                    form.setValue(
                      "workshopIds",
                      checked
                        ? [...currentIds, workshop.workshopId]
                        : currentIds.filter((id) => id !== workshop.workshopId),
                      { shouldDirty: true }
                    );
                  }}
                />
                <Label htmlFor={`workshop-${workshop.workshopId}`}>
                  {workshop.workshopName}
                </Label>
              </div>
            ))}
            {item.workshops.length === 0 && (
              <Button
                variant="default"
                size="extra-sm"
                onClick={handleCreateWorkshop}
                type="button"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                {t("Dishes.pricelist.create-workshop")}
              </Button>
            )}
          </div>
        </div>
        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        {isDirty && (
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              <SaveIcon className="mr-2 h-4 w-4" />
              {t("Dishes.pricelist.save")}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}
