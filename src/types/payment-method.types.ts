export enum PaymentMethodType {
  YOO_KASSA = "YOO_KASSA",
  CUSTOM = "CUSTOM",
}

export enum PaymentMethodIcon {
  YOO_KASSA = "YOO_KASSA",
  CASH = "CASH",
  CARD = "CARD",
}

export interface IPaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  icon: PaymentMethodIcon;
  restaurantId: string;
  secretId: string;
  isActive: boolean;
  isRemoved: boolean;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}
