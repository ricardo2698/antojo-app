import type { Order, OrderStatus } from '@/types';

export interface OrderWithStatus extends Order {
  status?: OrderStatus;
}

export interface OrderDetailProps {
  order: Order;
  statuses: OrderStatus[];
  isOpen: boolean;
  onClose: () => void;
}

