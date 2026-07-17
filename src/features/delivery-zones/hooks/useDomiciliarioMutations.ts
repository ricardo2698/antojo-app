import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';
import type { CreateDomiciliarioData, UpdateDomiciliarioData } from '@/types';

import { domiciliariosService } from '../services/domiciliarios.service';

export function useCreateDomiciliario(restaurantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDomiciliarioData) => domiciliariosService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.domiciliarios(restaurantId) }),
  });
}

export function useUpdateDomiciliario(restaurantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDomiciliarioData }) =>
      domiciliariosService.update(restaurantId, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.domiciliarios(restaurantId) }),
  });
}

export function useDeleteDomiciliario(restaurantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => domiciliariosService.delete(restaurantId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.domiciliarios(restaurantId) }),
  });
}
