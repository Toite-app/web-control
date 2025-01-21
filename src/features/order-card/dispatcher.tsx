"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";

import { IOrder } from "@/types/order.types";
import OrderCardHeader from "@/features/order-card/shared/header";
import OrderCardShortInfo from "@/features/order-card/shared/short-info";
import OrderCardStatusesSubheader from "@/features/order-card/shared/statuses-subheader";
import OrderCardStatusText from "@/features/order-card/shared/status-text";
import OrderCardTime from "@/features/order-card/shared/time";
import OrderCardPrice from "@/features/order-card/shared/price";
type DispatcherOrderCardProps = {
  order: IOrder;
};

export default function DispatcherOrderCard(props: DispatcherOrderCardProps) {
  const { order } = props;
  const { note, guestPhone, guestName } = order;

  const handlePhoneClick = () => {
    if (guestPhone) {
      window.location.href = `tel:${guestPhone}`;
    }
  };

  const handleWhatsAppClick = () => {
    if (guestPhone) {
      // Remove any non-digit characters from the phone number
      const cleanPhone = guestPhone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  return (
    <div className="flex w-full cursor-pointer flex-col overflow-clip rounded-lg bg-white shadow-md dark:bg-stone-800">
      <OrderCardHeader order={order} />
      <OrderCardStatusesSubheader order={order} />
      <div className="flex flex-col px-3 py-3">
        <OrderCardShortInfo order={order} />
        {note && (
          <div className="flex py-1">
            <p className="text-indigo-500 dark:text-indigo-300">{note}</p>
          </div>
        )}
        <OrderCardStatusText order={order} />
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-col">
            <OrderCardTime order={order} />
          </div>
          <OrderCardPrice order={order} />
        </div>
        {!!guestPhone && (
          <>
            <Separator className="my-1" />
            <div className="flex w-full flex-row items-center gap-1">
              <Button
                className="w-full"
                variant="primary-outline"
                size="sm"
                onClick={handlePhoneClick}
              >
                {`${guestName ? `${guestName}, ` : ""} ${
                  parsePhoneNumberFromString(
                    guestPhone
                  )?.formatInternational() ?? guestPhone
                }`}
              </Button>
              <Button
                variant="primary-outline"
                size="icon-btn-sm"
                onClick={handleWhatsAppClick}
              >
                <WhatsappLogo
                  className="h-4 w-4 text-green-600"
                  weight="fill"
                />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
