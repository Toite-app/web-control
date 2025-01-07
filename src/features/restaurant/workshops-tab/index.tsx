import { DataTable } from "@/components/data-table";
import { IRestaurant } from "@/types/restaurant.types";
import useRestaurantWorkshopsColumns from "./hooks/use-columns";
import { useGetRestaurantWorkshops } from "@/features/restaurant/api/useGetRestaurantWorkshops";
import useDialogsStore from "@/store/dialogs-store";

type Props = {
  restaurant?: IRestaurant;
};

const RestaurantWorkshopsTab = ({ restaurant }: Props) => {
  const toggleDialog = useDialogsStore((state) => state.toggle);

  const restaurantId = restaurant?.id ?? "";

  const { data, isLoading } = useGetRestaurantWorkshops({
    urlValues: {
      restaurantId,
    },
    skip: !restaurantId,
  });

  const columns = useRestaurantWorkshopsColumns({
    onEdit: (workshop) => {
      toggleDialog("restaurantWorkshop", true, {
        restaurantId,
        workshop,
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

export default RestaurantWorkshopsTab;
