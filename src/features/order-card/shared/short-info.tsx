import { Buildings } from "@phosphor-icons/react/dist/ssr/Buildings";
import { Person } from "@phosphor-icons/react/dist/ssr/Person";
import { Coins } from "@phosphor-icons/react/dist/ssr/Coins";
import { Percent } from "@phosphor-icons/react/dist/ssr/Percent";
import { SealPercent } from "@phosphor-icons/react/dist/ssr/SealPercent";
import { IOrder } from "@/types/order.types";

type Props = {
  order: IOrder;
};

export default function OrderCardShortInfo(props: Props) {
  const { order } = props;
  const {
    guestsAmount,
    bonusUsed,
    discountAmount,
    surchargeAmount,
    restaurantName,
  } = order;

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-row items-center gap-2">
        <Buildings className="h-4 w-4 text-stone-500" weight="fill" />
        <span className="uppercase text-stone-500">
          {restaurantName ?? "-"}
        </span>
      </div>
      <div className="flex flex-row items-center gap-2">
        {guestsAmount && (
          <div className="flex flex-row items-center gap-1 text-stone-500">
            <span>{guestsAmount}</span>
            <Person className="h-4 w-4" weight="fill" />
          </div>
        )}
        {Number(discountAmount) > 0 && (
          <SealPercent className="h-5 w-5 fill-green-700" weight="fill" />
        )}
        {Number(surchargeAmount) > 0 && (
          <Percent className="h-5 w-5 fill-green-700" weight="fill" />
        )}
        {Number(bonusUsed) > 0 && (
          <Coins className="h-5 w-5 fill-green-700" weight="fill" />
        )}
      </div>
    </div>
  );
}
