import type { Order, OrderStatus } from '@/types';

export interface OrderCardProps {
  order: Order;
  status?: OrderStatus;
  statuses: OrderStatus[];
  restaurantId: string;
  onOpen: (order: Order) => void;
  onAdvance: (orderId: string, nextStatusId: string) => void;
  onEdit: (order: Order) => void;
}
