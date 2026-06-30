import type { Restaurant } from '@/types';

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string, name: string) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
}
