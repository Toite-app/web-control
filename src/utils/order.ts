import { IOrder } from "@/types/order.types";

export class OrderUtils {
  static calculateOrderPercents(
    order: Pick<
      IOrder,
      "subtotal" | "discountAmount" | "surchargeAmount" | "bonusUsed"
    >
  ) {
    const { subtotal, discountAmount, surchargeAmount, bonusUsed } = order;

    const subtotalValue = Number(subtotal);
    const discountAmountValue = Number(discountAmount);
    const surchargeAmountValue = Number(surchargeAmount);
    const bonusUsedValue = Number(bonusUsed);

    // If subtotal is 0 or NaN, return all percents as 0 to prevent division by zero
    if (!subtotalValue) {
      return {
        discountPercent: 0,
        surchargePercent: 0,
        bonusUsedPercent: 0,
      };
    }

    const discountPercent = Number.isNaN(
      (discountAmountValue / subtotalValue) * 100
    )
      ? 0
      : (discountAmountValue / subtotalValue) * 100;

    const surchargePercent = Number.isNaN(
      (surchargeAmountValue / subtotalValue) * 100
    )
      ? 0
      : (surchargeAmountValue / subtotalValue) * 100;

    const bonusUsedPercent = Number.isNaN(
      (bonusUsedValue / subtotalValue) * 100
    )
      ? 0
      : (bonusUsedValue / subtotalValue) * 100;

    return { discountPercent, surchargePercent, bonusUsedPercent };
  }
}
