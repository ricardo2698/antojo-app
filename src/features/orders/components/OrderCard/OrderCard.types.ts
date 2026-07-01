import type { Order, OrderStatus } from '@/types';

export interface OrderCardProps {
  order: Order;
  status?: OrderStatus;
  statuses: OrderStatus[];
  onOpen: (order: Order) => void;
  onAdvance: (orderId: string, nextStatusId: string) => void;
}
