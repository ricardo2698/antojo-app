import type { Order, OrderStatus, Product } from '@/types';

export interface OrderDetailModalProps {
  order: Order | null;
  statuses: OrderStatus[];
  products: Product[];
  restaurantId: string;
  isOpen: boolean;
  onClose: () => void;
}
