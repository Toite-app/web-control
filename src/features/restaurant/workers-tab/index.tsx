import { DataTable } from "@/components/data-table";
import { useGetWorkers } from "@/features/workers/api/useGetWorkers";
import { useGetColumns } from "@/features/workers/components/data-table/hooks/useGetColumns";
import { buildFiltersParam } from "@/lib/filters";
import useDialogsStore from "@/store/dialogs-store";
import { IRestaurant } from "@/types/restaurant.types";
import { IWorker } from "@/types/worker.types";
import { useMemo } from "react";

type Props = {
  restaurant?: IRestaurant;
};

const RestaurantWorkersTab = ({ restaurant }: Props) => {
  const restaurantId = restaurant?.id ?? "";

  const toggleDialog = useDialogsStore((state) => state.toggle);

  const filters = useMemo(() => {
    return buildFiltersParam<IWorker>([
      {
        field: "restaurantId",
        condition: "equals",
        value: restaurantId,
      },
    ]);
  }, [restaurantId]);

  const { data, isLoading } = useGetWorkers({
    params: {
      filters,
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
