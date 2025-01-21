import { RussianRubleIcon } from "lucide-react";
import { Buildings } from "@phosphor-icons/react/dist/ssr/Buildings";
import { Coins } from "@phosphor-icons/react/dist/ssr/Coins";
import { Percent } from "@phosphor-icons/react/dist/ssr/Percent";
import { SealPercent } from "@phosphor-icons/react/dist/ssr/SealPercent";
import { Person } from "@phosphor-icons/react/dist/ssr/Person";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { CookingPot } from "@phosphor-icons/react/dist/ssr/CookingPot";
import { ChefHat } from "@phosphor-icons/react/dist/ssr/ChefHat";

export default function OrdersPageContent() {
  return (
    <div className="flex w-full flex-col p-4">
      <div className="flex w-full max-w-[350px] cursor-pointer flex-col overflow-clip rounded-lg bg-white shadow-md">
        <div className="flex w-full flex-row items-center justify-between bg-orange-400 px-2 py-1">
          <span className="text-lg font-bold text-white">№1 214</span>
          <div className="flex flex-row items-center gap-4">
            {/* <TableIcon className="h-4 w-4 text-white" />
             */}

            <div className="max-h-[22px] rounded-xl bg-white px-3">
              <span className="text-sm text-stone-700">1 / 0 / 4</span>
            </div>
            <svg
              className="h-5 w-5 fill-white"
              viewBox="0 0 24 24"
              data-testid="TableBarIcon"
              aria-label="Банкет"
            >
              <path d="M22 7.5C22 5.57 17.52 4 12 4S2 5.57 2 7.5c0 1.81 3.95 3.31 9 3.48V15H9.35c-.82 0-1.55.5-1.86 1.26L6 20h2l1.2-3h5.6l1.2 3h2l-1.5-3.74c-.3-.76-1.04-1.26-1.85-1.26H13v-4.02c5.05-.17 9-1.67 9-3.48z"></path>
            </svg>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 bg-lime-600 px-2 py-1">
          <ChefHat className="h-4 w-4 text-white" weight="fill" />
          <span className="text-sm text-white">Блюда приготовлены</span>
        </div>
        <div className="flex flex-row items-center gap-2 bg-red-600 px-2 py-1">
          <Buildings className="h-4 w-4 text-white" weight="fill" />
          <span className="text-sm text-white">Назначьте ресторан</span>
        </div>
        <div className="flex flex-row items-center gap-2 bg-red-600 px-2 py-1">
          <CookingPot className="h-4 w-4 text-white" weight="fill" />
          <span className="text-sm text-white">Отправьте на кухню</span>
        </div>
        <div className="flex flex-row items-center gap-2 bg-indigo-600 px-2 py-1">
          <Clock className="h-4 w-4 text-white" weight="fill" />
          <span className="text-sm text-white">Отложено к 25.01.25</span>
        </div>
        <div className="flex flex-col px-3 py-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Buildings className="h-4 w-4 text-stone-500" weight="fill" />
              <span className="uppercase text-stone-500">Жулебино </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row items-center gap-1 text-stone-500">
                <span>1</span>
                <Person className="h-4 w-4" weight="fill" />
              </div>
              <SealPercent className="h-5 w-5 fill-green-700" weight="fill" />
              <Percent className="h-5 w-5 fill-green-700" weight="fill" />
              <Coins className="h-5 w-5 fill-green-700" weight="fill" />
            </div>
          </div>
          <div className="flex py-1">
            <p className="text-indigo-500">на 25 января, начало в 17:00</p>
          </div>
          <span className="text-sm uppercase text-stone-500">Заказ создан</span>
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold">21.01.25 11:07</span>
            </div>
            <div className="flex flex-row items-center gap-1 text-sm">
              <span>2 510</span>
              <RussianRubleIcon className="h-4 w-4" />
            </div>
          </div>
          <Separator className="my-1" />
          <div className="flex w-full flex-row items-center gap-1">
            <Button className="w-full" variant="primary-outline" size="sm">
              Yefrosynii, +372 (5626) 7207
            </Button>
            <Button variant="primary-outline" size="icon-btn-sm">
              <WhatsappLogo className="h-4 w-4 text-green-600" weight="fill" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
