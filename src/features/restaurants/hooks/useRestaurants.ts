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
