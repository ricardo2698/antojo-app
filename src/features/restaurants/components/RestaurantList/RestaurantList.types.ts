import type { Restaurant } from '@/types';

export interface RestaurantListProps {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string, name: string) => void;
  togglingId?: string | null;
  deletingId?: string | null;
}
