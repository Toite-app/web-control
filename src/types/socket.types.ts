import { IOrder } from "@/types/order.types";

export enum GatewayIncomingMessage {
  SUBSCRIPTION = "subscription",
}

export enum ClientSubscriptionType {
  ORDER = "ORDER",
}

export interface ClientOrderSubscription {
  orderId: string;
}

export type ClientSubscription = {
  id: string;
  type: `${ClientSubscriptionType.ORDER}`;
  data: ClientOrderSubscription;
};

export enum IncomingSubscriptionAction {
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
}

export type IncomingSubscription = ClientSubscription & {
  action: `${IncomingSubscriptionAction}`;
};

export enum SocketEventType {
  SUBSCRIPTION_UPDATE = "subscription:update",
}

export type SocketOrderUpdateEvent = {
  id: string;
  type: "ORDER";
  order: IOrder;
};

export type SocketEventData = SocketOrderUpdateEvent;

export interface SocketEvent {
  type: `${SocketEventType}`;
  data: SocketEventData;
}
