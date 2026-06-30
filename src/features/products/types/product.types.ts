import type { Additional } from '@/types';

export interface ProductFormData {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string;
  additionals: Additional[];
  isActive: boolean;
  isAvailable: boolean;
  sortOrder: number;
}

export interface AdditionalFormRow {
  name: string;
  price: number;
}
