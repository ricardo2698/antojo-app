import type { Order, OrderStatus } from '@/types';

export interface OrdersTableProps {
  orders: Order[];
  statuses: OrderStatus[];
  onExport: () => void;
}
