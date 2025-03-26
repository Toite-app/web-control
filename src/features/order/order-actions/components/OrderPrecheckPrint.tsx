import CurrencyIcon from "@/components/currency-icon";
import { Separator } from "@/components/ui/separator";
import { IOrderPrecheck } from "@/types/order-history.types";
import format from "@/utils/date-fns";
import TOITE_CONFIG from "@config";
import { QRCodeCanvas } from "qrcode.react";
import { useLocale, useTranslations } from "next-intl";
import { forwardRef, useEffect, useMemo } from "react";

type Props = {
  precheck: IOrderPrecheck;
  onReady?: () => void;
};

const OrderPrecheckPrint = forwardRef<HTMLDivElement, Props>(
  ({ precheck, onReady }, ref) => {
    const t = useTranslations();
    const locale = useLocale();

    const prices = useMemo(() => {
      return precheck.positions.reduce(
        (
          acc,
          { discountAmount, surchargeAmount, price, finalPrice, quantity }
        ) => {
          return {
            discountAmount:
              acc.discountAmount + Number(discountAmount) * quantity,
            surchargeAmount:
              acc.surchargeAmount + Number(surchargeAmount) * quantity,
            price: acc.price + Number(price) * quantity,
            finalPrice: acc.finalPrice + Number(finalPrice) * quantity,
          };
        },
        {
          discountAmount: 0,
          surchargeAmount: 0,
          price: 0,
          finalPrice: 0,
        }
      );
    }, [precheck.positions]);

    const discountPercent = useMemo(() => {
      return (prices.discountAmount / prices.price) * 100;
    }, [prices.discountAmount, prices.price]);

    const surchargePercent = useMemo(() => {
      return (prices.surchargeAmount / prices.price) * 100;
    }, [prices.surchargeAmount, prices.price]);

    useEffect(() => {
      setTimeout(() => {
        onReady?.();
      }, 1000);
    }, [ref, onReady]);

    return (
      <div
        className="flex w-[400px] min-w-[400px] max-w-[400px] flex-col gap-2 border-l border-r border-stone-300 px-4 py-12"
        ref={ref}
      >
        <div className="mx-auto">
          <img
            src={TOITE_CONFIG.logo.app}
            alt={TOITE_CONFIG.appName}
            className="w-full max-w-[150px]"
          />
        </div>
        <div className="mt-4 flex flex-col">
          <h1 className="text-center text-4xl font-bold ">
            {TOITE_CONFIG.appName}
          </h1>
          <p className="text-xl">{precheck.legalEntity}</p>
        </div>
        <Separator />
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <h2 className="max-w-[200px] text-3xl font-bold">
              {t("precheck.order-number", {
                orderNumber: precheck.order.number,
              })}
            </h2>
            <div className="flex flex-col">
              <p className="text-right text-xl">
                {format(
                  new Date(precheck.createdAt),
                  "HH:mm, dd.MM.yyyy",
                  locale
                )}
              </p>
              <p className="text-right text-xl">
                {t(`precheck.order-type.${precheck.type}`)}
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-xl">
              {t("precheck.printed-by", {
                workerName: precheck.worker.name,
                workerRole: t(`precheck.worker-role.${precheck.worker.role}`),
              })}
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          {precheck.positions.map(({ id, name, quantity, finalPrice }) => (
            <div className="flex w-full flex-row items-center" key={id}>
              <p className="flex w-full min-w-[175px] max-w-[175px] text-2xl font-semibold">
                {name}
              </p>
              <p className="flex w-full max-w-[100px] text-2xl">
                {t("precheck.quantity", { quantity })}
              </p>
              <p className="flex flex-row items-end">
                <p className="text-2xl">
                  {(Number(finalPrice) * quantity).toFixed(2)}
                  <span>
                    <CurrencyIcon
                      className="ml-1 inline-block h-5 w-5"
                      currency={precheck.currency}
                    />
                  </span>
                </p>
              </p>
            </div>
          ))}
          <Separator />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center">
              <p className="text-2xl">
                {t("precheck.summary")}:{"  "}
                <span className="font-bold">
                  {prices.finalPrice.toFixed(2)}
                </span>
              </p>
              <CurrencyIcon
                className="inline-block h-6 w-6"
                currency={precheck.currency}
              />
            </div>
            {discountPercent > 0 && (
              <div className="ml-auto flex flex-row items-center gap-1">
                <p className="text-xl">
                  {t("precheck.discount")}:{"  "}
                  <span>{`${discountPercent.toFixed(0)}%`}</span>
                </p>
                <div className="flex flex-row items-center text-xl">
                  {`(-${prices.discountAmount.toFixed(2)}`}
                  <CurrencyIcon
                    className="inline-block h-5 w-5"
                    currency={precheck.currency}
                  />
                  {")"}
                </div>
              </div>
            )}
            {surchargePercent > 0 && (
              <div className="ml-auto flex flex-row items-center gap-1">
                <p className="text-xl">
                  {t("precheck.surcharge")}:{"  "}
                  <span>{`${surchargePercent.toFixed(0)}%`}</span>
                </p>
                <div className="flex flex-row items-center text-xl">
                  {`(+${prices.surchargeAmount.toFixed(2)}`}
                  <CurrencyIcon
                    className="inline-block h-5 w-5"
                    currency={precheck.currency}
                  />
                  {")"}
                </div>
              </div>
            )}
            <div className="flex flex-row items-center">
              <p className="text-2xl">
                {t("precheck.for-payment")}:{"  "}
                <span className="font-bold">
                  {prices.finalPrice.toFixed(2)}
                </span>
              </p>
              <CurrencyIcon
                className="inline-block h-6 w-6"
                currency={precheck.currency}
              />
            </div>
          </div>
          <Separator />
          <div className="flex flex-col items-center justify-center">
            <p className="max-w-[300px] text-center text-2xl">
              {t("precheck.outro")}
            </p>
            <p className="mt-1 text-center text-2xl font-bold">
              {TOITE_CONFIG.appDomain}
            </p>
            <div className="mt-2">
              <QRCodeCanvas
                size={240}
                value={`https://${TOITE_CONFIG.appDomain}`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OrderPrecheckPrint.displayName = "OrderPrecheckPrint";

export default OrderPrecheckPrint;
