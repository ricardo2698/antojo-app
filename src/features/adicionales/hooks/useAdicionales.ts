import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';
import type { CreateAdicionalData, UpdateAdicionalData } from '@/types';

import { adicionalesService } from '../services/adicionales.service';

export function useAdicionales(restaurantId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.adicionales(restaurantId ?? ''),
    queryFn: () => adicionalesService.getAll(restaurantId!),
    enabled: !!restaurantId,
  });
}

export function useCreateAdicional(restaurantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdicionalData) => adicionalesService.create(restaurantId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.adicionales(restaurantId) }),
  });
}

export function useUpdateAdicional(restaurantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdicionalData }) =>
      adicionalesService.update(restaurantId, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.adicionales(restaurantId) }),
  });
}

export function useDeleteAdicional(restaurantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adicionalesService.delete(restaurantId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.adicionales(restaurantId) }),
  });
}
