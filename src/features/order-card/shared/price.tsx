import { IOrder } from "@/types/order.types";
import CurrencyIcon from "@/components/currency-icon";
import formatPrice from "@/utils/format-price";

type Props = {
  order: Pick<IOrder, "total" | "currency">;
};

export default function OrderCardPrice(props: Props) {
  const { order } = props;
  const { total, currency } = order;

  return (
    <div className="flex flex-row items-center gap-1 text-sm">
      <span>
        {formatPrice(total, { groupNumbers: true, alwaysShowDecimals: true })}
      </span>
      <CurrencyIcon className="h-4 w-4" currency={currency} />
    </div>
  );
}
