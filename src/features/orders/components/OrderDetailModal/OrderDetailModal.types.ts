import type { Order, OrderStatus } from '@/types';

export interface OrderDetailModalProps {
  order: Order | null;
  statuses: OrderStatus[];
  restaurantId: string;
  isOpen: boolean;
  onClose: () => void;
}
