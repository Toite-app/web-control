import { DataTable } from "@/components/data-table";
import { IRestaurant } from "@/types/restaurant.types";

import useRestaurantHoursColumns from "./hooks/use-columns";
import { useGetRestaurantHours } from "@/features/restaurant/api/useGetRestaurantHours";

type Props = {
  restaurant?: IRestaurant;
};

const RestaurantHoursTab = ({ restaurant }: Props) => {
  const { data, isLoading } = useGetRestaurantHours({
    urlValues: {
      restaurantId: restaurant?.id ?? "",
    },
    skip: !restaurant,
  });

  const columns = useRestaurantHoursColumns();

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
