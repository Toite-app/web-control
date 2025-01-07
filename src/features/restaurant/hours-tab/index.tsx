import { DataTable } from "@/components/data-table";
import { IRestaurant } from "@/types/restaurant.types";

import useRestaurantHoursColumns from "./hooks/use-columns";
import { useGetRestaurantHours } from "@/features/restaurant/api/useGetRestaurantHours";
import useDialogsStore from "@/store/dialogs-store";

type Props = {
  restaurant?: IRestaurant;
};

const RestaurantHoursTab = ({ restaurant }: Props) => {
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const restaurantId = restaurant?.id ?? "";

  const { data, isLoading } = useGetRestaurantHours({
    urlValues: {
      restaurantId,
    },
    skip: !restaurantId,
  });

  const columns = useRestaurantHoursColumns({
    onEdit: (hour) => {
      toggleDialog("restaurantHour", true, {
        restaurantId,
        hour,
      });
    },
  });

  return (
    <div>
      <DataTable
        className="h-[75vh] overflow-clip bg-stone-200/30 dark:bg-stone-800/20"
        {...{
          data,
          columns,
          isLoading,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RestaurantHoursTab;
