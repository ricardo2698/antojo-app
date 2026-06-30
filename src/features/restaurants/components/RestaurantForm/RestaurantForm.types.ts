import type { Restaurant } from '@/types';

export interface RestaurantFormProps {
  restaurant?: Restaurant;
  onSuccess: () => void;
  onCancel: () => void;
}
