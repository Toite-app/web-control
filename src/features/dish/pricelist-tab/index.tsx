import { useGetDishPricelist } from "@/api/fetch/dishes/pricelist/useGetDishPricelist";
import { IDish } from "@/types/dish.types";
import { PricelistItem } from "./pricelist-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

type Props = {
  data?: IDish;
};

export default function DishPricelistTab(props: Props) {
  const { data } = props;
  const t = useTranslations();

  const { data: pricelist, isLoading } = useGetDishPricelist({
    urlValues: {
      dishId: data?.id ?? "",
    },
    config: {
      keepPreviousData: true,
    },
    skip: !data?.id,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!pricelist?.length) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">{t("Dishes.pricelist.noData")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {pricelist.map((item) => (
        <PricelistItem key={item.restaurantId} dish={data} item={item} />
      ))}
    </div>
  );
}
