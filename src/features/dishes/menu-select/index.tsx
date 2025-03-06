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
import { useEffect } from "react";

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
  autoselectAvailable?: boolean;
};

export default function DishesMenuSelect({
  value,
  onChange,
  autoselectAvailable,
}: Props) {
  const t = useTranslations();
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
    if (!autoselectAvailable || dishesMenus.length === 0) return;

    onChange(dishesMenus[0].id);
  }, [autoselectAvailable, dishesMenus, onChange]);

  return (
    <Select
      value={value ?? undefined}
      onValueChange={onChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("Dishes.selectMenu")} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedMenus).map(([ownerName, menus]) => (
          <SelectGroup key={ownerName}>
            <SelectLabel>{ownerName}</SelectLabel>
            {menus.map((menu) => (
              <SelectItem
                className="cursor-pointer"
                key={menu.id}
                value={menu.id}
              >
                {menu.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
