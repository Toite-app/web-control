export enum GatewayIncomingMessage {
  CURRENT_PATHNAME = "CURRENT_PATHNAME",
}

export enum SocketEventType {
  REVALIDATE_ORDER = "revalidate-order",
}

export type SocketRevalidateOrderEvent = {
  orderId: string;
};

export interface SocketEvent {
  type: `${SocketEventType}`;
}
