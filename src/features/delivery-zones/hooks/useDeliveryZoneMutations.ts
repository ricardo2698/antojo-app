import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';
import type { CreateDeliveryZoneData, UpdateDeliveryZoneData } from '@/types';

import { deliveryZonesService } from '../services/delivery-zones.service';

export function useCreateDeliveryZone(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeliveryZoneData) =>
      deliveryZonesService.create(restaurantId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deliveryZones(restaurantId) });
    },
  });
}

export function useUpdateDeliveryZone(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeliveryZoneData }) =>
      deliveryZonesService.update(restaurantId, id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deliveryZones(restaurantId) });
    },
  });
}

export function useDeleteDeliveryZone(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deliveryZonesService.delete(restaurantId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deliveryZones(restaurantId) });
    },
  });
}
