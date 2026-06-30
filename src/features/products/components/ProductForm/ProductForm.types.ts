import type { Category, Product } from '@/types';

export interface ProductFormProps {
  product?: Product;
  restaurantId: string;
  categories: Category[];
  defaultSortOrder?: number;
  onSuccess: () => void;
  onCancel: () => void;
}
