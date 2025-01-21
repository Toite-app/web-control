import { IOrder } from "@/types/order.types";
import { format } from "date-fns";

type Props = {
  order: IOrder;
};

export default function OrderCardTime(props: Props) {
  const { order } = props;
  const { createdAt } = order;

  return (
    <span className="text-lg font-bold">
      {format(createdAt, "dd.MM.yy HH:mm")}
    </span>
  );
}
