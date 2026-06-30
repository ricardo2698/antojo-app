import type { Category } from '@/types';

export interface CategoryFormData {
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CategoryFormProps {
  category?: Category;
  restaurantId: string;
  defaultSortOrder?: number;
  onSuccess: () => void;
  onCancel: () => void;
}
