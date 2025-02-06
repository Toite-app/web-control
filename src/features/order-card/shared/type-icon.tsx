import { OrderType } from "@/types/order.types";
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck";
import { Backpack } from "@phosphor-icons/react/dist/ssr/Backpack";
import { Cheers } from "@phosphor-icons/react/dist/ssr/Cheers";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  type: OrderType;
};

export default function OrderTypeIcon({ className, type }: Props) {
  if (type === "hall") {
    return (
      <svg className={cn("h-5 w-5 fill-white", className)} viewBox="0 0 24 24">
        <path d="M22 7.5C22 5.57 17.52 4 12 4S2 5.57 2 7.5c0 1.81 3.95 3.31 9 3.48V15H9.35c-.82 0-1.55.5-1.86 1.26L6 20h2l1.2-3h5.6l1.2 3h2l-1.5-3.74c-.3-.76-1.04-1.26-1.85-1.26H13v-4.02c5.05-.17 9-1.67 9-3.48z"></path>
      </svg>
    );
  }

  if (type === "delivery") {
    return (
      <Truck className={cn("h-5 w-5 text-white", className)} weight="fill" />
    );
  }

  if (type === "takeaway") {
    return (
      <Backpack className={cn("h-5 w-5 text-white", className)} weight="fill" />
    );
  }

  if (type === "banquet") {
    return (
      <Cheers className={cn("h-5 w-5 text-white", className)} weight="fill" />
    );
  }

  return null;
}
