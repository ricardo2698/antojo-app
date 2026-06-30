import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';

import { orderStatusesService } from '../services/order-statuses.service';

export function useOrderStatuses(restaurantId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.orderStatuses(restaurantId),
    queryFn: () => orderStatusesService.getAll(restaurantId),
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
}
