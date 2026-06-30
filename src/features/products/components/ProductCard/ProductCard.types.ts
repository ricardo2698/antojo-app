import type { Category, Product } from '@/types';

export interface ProductCardProps {
  product: Product;
  category?: Category;
  onEdit: (product: Product) => void;
  onToggleAvailable: (id: string, isAvailable: boolean) => void;
  onDelete: (id: string, name: string) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
}
