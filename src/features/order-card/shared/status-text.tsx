"use client";

import { useTranslations } from "next-intl";
import { IOrder } from "@/types/order.types";

type Props = {
  order: IOrder;
};

export default function OrderCardStatusText(props: Props) {
  const { order } = props;
  const { status } = order;

  const t = useTranslations();

  return (
    <span className="text-sm uppercase text-stone-500">
      {t(`OrderCard.statuses.general.${status}`)}
    </span>
  );
}
