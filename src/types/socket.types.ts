export enum GatewayIncomingMessage {
  SUBSCRIPTION = "subscription",
}

export enum ClientSubscriptionType {
  NEW_ORDERS = "NEW_ORDERS",
  NEW_ORDERS_AT_KITCHEN = "NEW_ORDERS_AT_KITCHEN",
  ORDERS_UPDATE = "ORDERS_UPDATE",
}

export interface ClientOrderSubscription {
  orderId: string;
}

export type ClientSubscription =
  | {
      id: string;
      type: `${ClientSubscriptionType.NEW_ORDERS}`;
    }
  | {
      id: string;
      type: `${ClientSubscriptionType.NEW_ORDERS_AT_KITCHEN}`;
    }
  | {
      id: string;
      type: `${ClientSubscriptionType.ORDERS_UPDATE}`;
      data: {
        orderIds: string[];
      };
    };

export enum IncomingSubscriptionAction {
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
}

export type IncomingSubscription = {
  action: `${IncomingSubscriptionAction}`;
} & (
  | {
      id: string;
      type: `${ClientSubscriptionType.NEW_ORDERS}`;
    }
  | {
      id: string;
      type: `${ClientSubscriptionType.NEW_ORDERS_AT_KITCHEN}`;
    }
  | {
      id: string;
      type: `${ClientSubscriptionType.ORDERS_UPDATE}`;
      data: {
        orderIds: string[];
      };
    }
);

export enum SocketEventType {
  SUBSCRIPTION_UPDATE = "subscription:update",
}

export type SocketOrderUpdateEvent = {
  id: string;
  type: "ORDER";
  orderId: string;
};

export type SocketNewOrderEvent = {
  id: string;
  type: "NEW_ORDER";
};

export type SocketEventData = SocketOrderUpdateEvent | SocketNewOrderEvent;

export interface SocketEvent {
  type: `${SocketEventType}`;
  data: SocketEventData | SocketNewOrderEvent;
}
