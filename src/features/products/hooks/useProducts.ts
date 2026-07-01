import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';

import { productsService } from '../services/products.service';

export function useProducts(restaurantId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.products(restaurantId),
    queryFn: () => productsService.getAll(restaurantId),
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(restaurantId: string, id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => productsService.getById(restaurantId, id),
    enabled: !!restaurantId && !!id,
  });
}
