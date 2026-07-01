import type { Restaurant } from '@/types';

export interface RestaurantColorsPayload {
  pri: string;
  sec: string;
  acc: string;
  bg: string;
  name: string;
}

export interface RestaurantFormProps {
  restaurant?: Restaurant;
  onSuccess: () => void;
  onCancel: () => void;
  onColorsChange?: (colors: RestaurantColorsPayload) => void;
}
