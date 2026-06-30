import type { Order, OrderStatus } from '@/types';

export interface OrderCardProps {
  order: Order;
  status?: OrderStatus;
  onOpen: (order: Order) => void;
}
