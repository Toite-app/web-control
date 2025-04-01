"use client";

import { useGetDishesMenus } from "@/api/fetch/dishes-menus/useGetDishesMenus";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useDialogsStore, { DialogType } from "@/store/dialogs-store";
import { IDishesMenu } from "@/types/dishes-menu.types";

type Props = {
  value?: string | null;
  onChange: (value: IDishesMenu | null) => void;
  autoselectAvailable?: boolean;
  excludedIds?: string[];
};

export default function DishesMenuSelect({
  value,
  onChange,
  autoselectAvailable,
  excludedIds,
}: Props) {
  const [open, setOpen] = useState(false);

  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const { data: dishesMenus = [], isLoading } = useGetDishesMenus({
    config: {
      keepPreviousData: true,
    },
  });

  // Group menus by owner
  const groupedMenus = useMemo(() => {
    return Object.entries(
      dishesMenus.reduce(
        (acc, menu) => {
          if (excludedIds?.includes(menu.id)) return acc;

          const ownerName = menu.owner.name;
          if (!acc[ownerName]) {
            acc[ownerName] = [];
          }
          acc[ownerName].push(menu);
          return acc;
        },
        {} as Record<string, typeof dishesMenus>
      )
    ).filter(([, menus]) => menus.length > 0);
  }, [dishesMenus, excludedIds]);

  useEffect(() => {
    if (value) return;
    if (!autoselectAvailable || dishesMenus.length === 0) return;

    onChange(dishesMenus[0]);
  }, [autoselectAvailable, dishesMenus, onChange, value]);

  return (
    <Select
      value={value || ""}
      onValueChange={(value) =>
        onChange(dishesMenus.find((menu) => menu.id === value) || null)
      }
      disabled={isLoading}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("Dishes.selectMenu")} />
      </SelectTrigger>
      <SelectContent>
        {groupedMenus.map(([ownerName, menus]) => (
          <SelectGroup key={ownerName}>
            <SelectLabel>
              <span>{ownerName}</span>
            </SelectLabel>
            {menus.map((menu) => (
              <div
                className="flex flex-row items-center gap-1 selection:bg-accent hover:bg-accent active:bg-accent"
                key={menu.id}
              >
                <SelectItem
                  className="relative flex cursor-pointer"
                  key={menu.id}
                  value={menu.id}
                >
                  <span>{menu.name}</span>
                  {/* <div className="flex w-full items-center justify-between">
                  </div> */}
                </SelectItem>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDialog(DialogType.DishesMenu, true, {
                        dishesMenu: menu,
                      });
                      setOpen(false);
                    }}
                    className="rounded-sm p-2 hover:bg-accent "
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (value === menu.id) {
                        onChange(null);
                      }

                      toggleDialog(DialogType.DishesMenuDelete, true, {
                        dishesMenu: menu,
                      });
                      setOpen(false);
                    }}
                    className="rounded-sm p-2 hover:bg-accent"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </SelectGroup>
        ))}
        {dishesMenus.length > 0 && <Separator className="my-2" />}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleDialog(DialogType.DishesMenu, true, {});
            setOpen(false);
          }}
          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
        >
          <Plus className="h-4 w-4" />
          {t("Dishes.createMenu")}
        </button>
      </SelectContent>
    </Select>
  );
}
