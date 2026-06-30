import type { OrderStatus } from '@/types';

export interface OrderStatusFormProps {
  status?: OrderStatus;
  restaurantId: string;
  defaultSortOrder?: number;
  onSuccess: () => void;
  onCancel: () => void;
}
