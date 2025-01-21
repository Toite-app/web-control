import formatOrderNumber from "@/utils/format-order-number";
import { IOrder } from "@/types/order.types";
import { cn } from "@/lib/utils";
type Props = {
  order: IOrder;
};

export default function OrderCardHeader(props: Props) {
  const { order } = props;
  const { number, status, type } = order;

  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between bg-stone-400 px-2 py-1",
        status === "pending" && "bg-indigo-500 dark:bg-indigo-800",
        status === "cooking" && "bg-orange-500 dark:bg-orange-800",
        status === "ready" && "bg-green-500 dark:bg-green-800",
        status === "delivering" && "bg-blue-500 dark:bg-blue-800",
        status === "paid" && "bg-purple-500 dark:bg-purple-800",
        status === "completed" && "bg-gray-500 dark:bg-gray-800",
        status === "cancelled" && "bg-gray-500 dark:bg-gray-800"
      )}
    >
      <span className="text-lg font-bold text-white dark:text-stone-100">
        {formatOrderNumber(number)}
      </span>
      <div className="flex flex-row items-center gap-4">
        <div className="max-h-[22px] rounded-xl bg-white px-3">
          <span className="text-sm text-stone-700">1 / 0 / 4</span>
        </div>
        {type === "hall" && (
          <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
            <path d="M22 7.5C22 5.57 17.52 4 12 4S2 5.57 2 7.5c0 1.81 3.95 3.31 9 3.48V15H9.35c-.82 0-1.55.5-1.86 1.26L6 20h2l1.2-3h5.6l1.2 3h2l-1.5-3.74c-.3-.76-1.04-1.26-1.85-1.26H13v-4.02c5.05-.17 9-1.67 9-3.48z"></path>
          </svg>
        )}
      </div>
    </div>
  );
}
