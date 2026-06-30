import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';

import { categoriesService } from '../services/categories.service';

export function useCategories(restaurantId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.categories(restaurantId),
    queryFn: () => categoriesService.getAll(restaurantId),
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
}
