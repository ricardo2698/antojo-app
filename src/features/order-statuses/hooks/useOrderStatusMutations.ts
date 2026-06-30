import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';
import type { CreateOrderStatusData, OrderStatus } from '@/types';

import { orderStatusesService } from '../services/order-statuses.service';

export function useCreateOrderStatus(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderStatusData) => orderStatusesService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orderStatuses(restaurantId) });
    },
  });
}

export function useUpdateOrderStatus(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Pick<OrderStatus, 'name' | 'color' | 'sortOrder' | 'isActive'>>;
    }) => orderStatusesService.update(restaurantId, id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orderStatuses(restaurantId) });
    },
  });
}

export function useToggleOrderStatusActive(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      orderStatusesService.toggleActive(restaurantId, id, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orderStatuses(restaurantId) });
    },
  });
}

export function useDeleteOrderStatus(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderStatusesService.delete(restaurantId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orderStatuses(restaurantId) });
    },
  });
}
