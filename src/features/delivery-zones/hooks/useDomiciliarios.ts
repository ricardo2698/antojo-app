import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';

import { domiciliariosService } from '../services/domiciliarios.service';

export function useDomiciliarios(restaurantId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.domiciliarios(restaurantId ?? ''),
    queryFn: () => domiciliariosService.getAll(restaurantId!),
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
}
