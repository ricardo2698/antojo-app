import type { Category } from '@/types';

export interface CategoryFormProps {
  category?: Category;
  restaurantId: string;
  defaultSortOrder?: number;
  onSuccess: () => void;
  onCancel: () => void;
}
