"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetRestaurants } from "@/features/restaurants/api/useGetRestaurants";
import { createDishesMenuMutation } from "@/api/fetch/dishes-menus/createDishesMenu";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { IDishesMenu } from "@/types/dishes-menu.types";
import { updateDishesMenuMutation } from "@/api/fetch/dishes-menus/updateDishesMenu";
import { useGetWorkers } from "@/features/workers/api/useGetWorkers";
import { buildFiltersParam } from "@/lib/filters";
import { IWorker, WorkerRole } from "@/types/worker.types";
import { useAuth } from "@/features/guards/api/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string(),
  restaurantIds: z.array(z.string()),
  ownerId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface DishesMenuDialogProps {
  data: {
    dishesMenu?: IDishesMenu;
  };
  open?: boolean;
  onClose?: () => void;
}

export default function DishesMenuDialog({
  data: { dishesMenu },
  open,
  onClose,
}: DishesMenuDialogProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const [search, setSearch] = useState("");

  const user = useAuth();

  const canAssignOwner =
    user.data?.role &&
    (user.data.role === WorkerRole.SYSTEM_ADMIN ||
      user.data.role === WorkerRole.CHIEF_ADMIN);

  const owners = useGetWorkers({
    params: {
      filters: buildFiltersParam<IWorker>([
        {
          field: "role",
          condition: "equals",
          value: "OWNER",
        },
      ]),
    },
    config: { keepPreviousData: true },
    skip: !open && canAssignOwner,
  });

  const isEdit = !!dishesMenu;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dishesMenu?.name ?? "",
      restaurantIds:
        dishesMenu?.restaurants.map((restaurant) => restaurant.id) ?? [],
      ownerId: dishesMenu?.ownerId ?? undefined,
    },
  });

  const selectedOwnerId = form.watch("ownerId");

  const { data: restaurantsData } = useGetRestaurants({
    params: {
      size: 100,
      ...(canAssignOwner && selectedOwnerId
        ? { ownerId: selectedOwnerId }
        : {}),
    },
    skip: !open || (canAssignOwner && !selectedOwnerId),
  });

  const filteredRestaurants = restaurantsData?.data.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async (values: FormValues) => {
    try {
      const submitData = {
        name: values.name,
        restaurantIds: values.restaurantIds,
        ...(canAssignOwner && values.ownerId
          ? { ownerId: values.ownerId }
          : {}),
      };

      if (isEdit) {
        await updateDishesMenuMutation({
          urlValues: {
            dishesMenuId: dishesMenu.id,
          },
          data: submitData,
        });

        toast({
          title: t("DishesMenuDialog.update-success"),
          description: t("DishesMenuDialog.update-success-description"),
          variant: "success",
        });
      } else {
        await createDishesMenuMutation({
          data: submitData,
        });

        toast({
          title: t("DishesMenuDialog.success"),
          description: t("DishesMenuDialog.success-description"),
          variant: "success",
        });
      }

      form.reset();
      setSearch("");
      onClose?.();
    } catch (error) {
      handleError({ error, form });
    }
  };

  const restaurantIds = form.watch("restaurantIds");

  const toggleRestaurant = (restaurantId: string) => {
    const currentIds = form.getValues("restaurantIds") ?? [];
    if (currentIds.includes(restaurantId)) {
      form.setValue(
        "restaurantIds",
        currentIds.filter((id) => id !== restaurantId)
      );
    } else {
      form.setValue("restaurantIds", [...currentIds, restaurantId]);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset({
        name: dishesMenu?.name ?? "",
        restaurantIds: (dishesMenu?.restaurants || []).map(
          (restaurant) => restaurant.id
        ),
        ownerId: dishesMenu?.ownerId ?? undefined,
      });
    }
  }, [open, dishesMenu, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
          setSearch("");
          onClose?.();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t(
              isEdit
                ? "DishesMenuDialog.edit-title"
                : "DishesMenuDialog.create-title"
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("DishesMenuDialog.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("DishesMenuDialog.name-placeholder")}
                      {...field}
                      error={!!form.formState.errors.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {canAssignOwner && (
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("DishesMenuDialog.owner")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "DishesMenuDialog.owner-placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {owners.data?.data.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id}>
                            {owner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormItem>
              <FormLabel>{t("DishesMenuDialog.restaurants")}</FormLabel>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("DishesMenuDialog.restaurants-search")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="space-y-2 p-4">
                    {filteredRestaurants?.map((restaurant) => (
                      <Button
                        key={restaurant.id}
                        type="button"
                        variant={
                          restaurantIds?.includes(restaurant.id)
                            ? "default"
                            : "outline"
                        }
                        className={cn("w-full justify-start", {
                          "bg-primary text-primary-foreground":
                            restaurantIds?.includes(restaurant.id),
                        })}
                        onClick={() => toggleRestaurant(restaurant.id)}
                      >
                        {restaurant.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              {form.formState.errors.restaurantIds && (
                <FormMessage>
                  {form.formState.errors.restaurantIds.message}
                </FormMessage>
              )}
            </FormItem>

            {form.formState.errors.root && (
              <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}

            <Button type="submit" className="w-full">
              {t(
                isEdit ? "DishesMenuDialog.update" : "DishesMenuDialog.submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
