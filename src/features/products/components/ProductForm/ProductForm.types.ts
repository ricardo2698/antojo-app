import type { Adicional, Category, Product } from '@/types';

export interface ProductFormProps {
  product?: Product;
  restaurantId: string;
  categories: Category[];
  adicionales: Adicional[];
  defaultSortOrder?: number;
  onSuccess: () => void;
  onCancel: () => void;
}
