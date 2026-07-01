export interface ProductFormData {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string;
  adicionalIds: string[];
  isActive: boolean;
  isAvailable: boolean;
  sortOrder: number;
}
