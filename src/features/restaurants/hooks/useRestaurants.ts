import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';

import { restaurantsService } from '../services/restaurants.service';

export function useRestaurants() {
  return useQuery({
    queryKey: QUERY_KEYS.restaurants,
    queryFn: () => restaurantsService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRestaurant(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.restaurant(id ?? ''),
    queryFn: () => restaurantsService.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
