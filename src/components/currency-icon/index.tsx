import { ICurrency } from "@/types/general.types";
import { RussianRubleIcon, DollarSignIcon, EuroIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  currency: `${ICurrency}` | string;
};

export default function CurrencyIcon({ currency, className }: Props) {
  if (currency === "RUB") {
    return <RussianRubleIcon className={cn(className)} />;
  }

  if (currency === "USD") {
    return <DollarSignIcon className={cn(className)} />;
  }

  if (currency === "EUR") {
    return <EuroIcon className={cn(className)} />;
  }

  return null;
}
