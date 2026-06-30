import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';
import type { CreateCategoryData, UpdateCategoryData } from '@/types';

import { categoriesService } from '../services/categories.service';

export function useCreateCategory(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) => categoriesService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories(restaurantId) });
    },
  });
}

export function useUpdateCategory(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      categoriesService.update(restaurantId, id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories(restaurantId) });
    },
  });
}

export function useToggleCategoryActive(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      categoriesService.toggleActive(restaurantId, id, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories(restaurantId) });
    },
  });
}

export function useDeleteCategory(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(restaurantId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories(restaurantId) });
    },
  });
}
