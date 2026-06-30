import type { OrderStatus } from '@/types';

export interface OrderStatusFormData {
  name: string;
  code: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

export interface OrderStatusFormProps {
  status?: OrderStatus;
  restaurantId: string;
  defaultSortOrder?: number;
  onSuccess: () => void;
  onCancel: () => void;
}
