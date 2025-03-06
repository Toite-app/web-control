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
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useDialogsStore, { DialogType } from "@/store/dialogs-store";

type Props = {
  value?: string | null;
  onChange: (value: string | null) => void;
  autoselectAvailable?: boolean;
};

export default function DishesMenuSelect({
  value,
  onChange,
  autoselectAvailable,
}: Props) {
  const [open, setOpen] = useState(false);

  const t = useTranslations();
  const toggleDialog = useDialogsStore((state) => state.toggle);
  const { data: dishesMenus = [], isLoading } = useGetDishesMenus();

  // Group menus by owner
  const groupedMenus = dishesMenus.reduce(
    (acc, menu) => {
      const ownerName = menu.owner.name;
      if (!acc[ownerName]) {
        acc[ownerName] = [];
      }
      acc[ownerName].push(menu);
      return acc;
    },
    {} as Record<string, typeof dishesMenus>
  );

  useEffect(() => {
    if (value) return;
    if (!autoselectAvailable || dishesMenus.length === 0) return;

    onChange(dishesMenus[0].id);
  }, [autoselectAvailable, dishesMenus, onChange, value]);

  return (
    <Select
      value={value ?? undefined}
      onValueChange={onChange}
      disabled={isLoading}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {value
            ? groupedMenus[Object.keys(groupedMenus)[0]]?.find(
                (m) => m.id === value
              )?.name
            : t("Dishes.selectMenu")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedMenus).map(([ownerName, menus]) => (
          <SelectGroup key={ownerName}>
            <SelectLabel>{ownerName}</SelectLabel>
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
                  <div className="flex w-full items-center justify-between">
                    <span>{menu.name}</span>
                  </div>
                </SelectItem>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      console.log("Edit menu:", menu.id);
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(false);

                      setTimeout(() => {
                        toggleDialog(DialogType.DishesMenu, true, {
                          dishesMenu: menu,
                        });
                      }, 0);
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
                      setOpen(false);

                      setTimeout(() => {
                        toggleDialog(DialogType.DishesMenuDelete, true, {
                          dishesMenu: menu,
                        });
                      }, 0);

                      if (value === menu.id) {
                        onChange(null);
                      }
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
            setOpen(false);

            setTimeout(() => {
              toggleDialog(DialogType.DishesMenu, true, {});
            }, 0);
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
