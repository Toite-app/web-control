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
