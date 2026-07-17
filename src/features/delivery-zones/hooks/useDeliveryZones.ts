import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';

import { deliveryZonesService } from '../services/delivery-zones.service';

export function useDeliveryZones(restaurantId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.deliveryZones(restaurantId ?? ''),
    queryFn: () => deliveryZonesService.getAll(restaurantId!),
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
}
