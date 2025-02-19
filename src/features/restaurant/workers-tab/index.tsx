import { DataTable } from "@/components/data-table";
import { useGetWorkers } from "@/features/workers/api/useGetWorkers";
import { useGetColumns } from "@/features/workers/components/data-table/hooks/useGetColumns";
import useDialogsStore from "@/store/dialogs-store";
import { IRestaurant } from "@/types/restaurant.types";

type Props = {
  restaurant?: IRestaurant;
};

const RestaurantWorkersTab = ({ restaurant }: Props) => {
  const restaurantId = restaurant?.id ?? "";

  const toggleDialog = useDialogsStore((state) => state.toggle);

  const { data, isLoading } = useGetWorkers({
    params: {
      restaurantIds: [restaurantId],
    },
    skip: !restaurantId,
  });

  const columns = useGetColumns({
    onEdit: (worker) => {
      toggleDialog("worker", true, worker);
    },
  });

  return (
    <div>
      <DataTable
        className="h-[75vh] overflow-clip bg-stone-200/30 dark:bg-stone-800/20"
        hideAccessoryKeys={["restaurantName"]}
        {...{
          data: data?.data ?? [],
          columns,
          isLoading: isLoading,
          // pagination: {
          //   ...pagination,
          //   meta: workers.data?.meta,
          // },
          // sorting,
        }}
      />
    </div>
  );
};

export default RestaurantWorkersTab;
