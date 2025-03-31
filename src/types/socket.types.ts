export enum GatewayIncomingMessage {
  CURRENT_PATHNAME = "CURRENT_PATHNAME",
}

export enum SocketEventType {
  /** For /orders/:orderId page */
  REVALIDATE_ORDER_PAGE = "R-3JK",
  /** For /orders/dispatcher */
  REVALIDATE_DISPATCHER_ORDERS_PAGE = "R-ZGI",
  /** For /orders/kitchen */
  REVALIDATE_KITCHENER_ORDERS_PAGE = "R-a2I",
}

export type SocketRevalidateOrderEvent = {
  orderId: string;
};

export interface SocketEvent {
  type: `${SocketEventType}`;
}
