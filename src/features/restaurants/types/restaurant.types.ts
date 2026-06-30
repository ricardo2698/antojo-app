import type { Restaurant } from '@/types';

export interface RestaurantFormData {
  name: string;
  slug: string;
  description: string;
  phone: string;
  logo: string;
  bannerImage: string;
  headerType: 'image' | 'text';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isActive: boolean;
  // Solo en creación
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface RestaurantFormProps {
  restaurant?: Restaurant;
  onSuccess: () => void;
  onCancel: () => void;
}
