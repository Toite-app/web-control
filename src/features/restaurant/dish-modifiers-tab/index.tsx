import { DataTable } from "@/components/data-table";
import { IRestaurant } from "@/types/restaurant.types";
import useDishModifiersColumns from "./hooks/use-columns";
import { useGetRestaurantDishModifiers } from "@/api/fetch/restaurants/dish-modifiers/useGetRestaurantDishModifiers";
import useDialogsStore from "@/store/dialogs-store";

type Props = {
  restaurant?: IRestaurant;
};

const RestaurantDishModifiersTab = ({ restaurant }: Props) => {
  const toggleDialog = useDialogsStore((state) => state.toggle);
  const restaurantId = restaurant?.id ?? "";

  const { data, isLoading } = useGetRestaurantDishModifiers({
    urlValues: {
      restaurantId,
    },
    skip: !restaurantId,
  });

  const columns = useDishModifiersColumns({
    onEdit: (modifier) => {
      toggleDialog("restaurantDishModifier", true, {
        restaurantId,
        modifier,
      });
    },
  });

  return (
    <div>
      <DataTable
        className="h-[75vh] overflow-clip bg-stone-200/30 dark:bg-stone-800/20"
        {...{
          data: data ?? [],
          columns,
          isLoading,
        }}
      />
    </div>
  );
};

export default RestaurantDishModifiersTab;
