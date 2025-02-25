import { IOrder } from "@/types/order.types";
import { RussianRubleIcon, EuroIcon, DollarSignIcon } from "lucide-react";

type Props = {
  order: Pick<IOrder, "total" | "currency">;
};

export default function OrderCardPrice(props: Props) {
  const { order } = props;
  const { total, currency } = order;

  return (
    <div className="flex flex-row items-center gap-1 text-sm">
      <span>{total}</span>
      {currency === "RUB" && <RussianRubleIcon className="h-4 w-4" />}
      {currency === "EUR" && <EuroIcon className="h-4 w-4" />}
      {currency === "USD" && <DollarSignIcon className="h-4 w-4" />}
    </div>
  );
}
