import { DataTable } from "@/components/data-table";
import { IRestaurant } from "@/types/restaurant.types";
import usePaymentMethodsColumns from "./hooks/use-columns";
import { useGetRestaurantPaymentMethods } from "@/api/fetch/restaurants/useGetRestaurantPaymentMethods";
import useDialogsStore from "@/store/dialogs-store";

type Props = {
  restaurant?: IRestaurant;
};

const RestaurantPaymentMethodsTab = ({ restaurant }: Props) => {
  const toggleDialog = useDialogsStore((state) => state.toggle);
  const restaurantId = restaurant?.id ?? "";

  const { data, isLoading } = useGetRestaurantPaymentMethods({
    urlValues: {
      restaurantId,
    },
    skip: !restaurantId,
  });

  const columns = usePaymentMethodsColumns({
    onEdit: (method) => {
      toggleDialog("restaurantPaymentMethod", true, {
        restaurantId,
        method,
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

export default RestaurantPaymentMethodsTab;
