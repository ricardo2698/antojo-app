import { useState } from 'react';
import { z } from 'zod';

import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types';

import type { CategoryFormData } from '../types/category.types';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  sortOrder: z.number().int().min(1, 'Debe ser mayor a 0'),
});

export function useCategoryForm(
  restaurantId: string,
  category?: Category,
  defaultSortOrder = 1
) {
  const isEditing = !!category;

  const [data, setData] = useState<CategoryFormData>({
    name: category?.name ?? '',
    description: category?.description ?? '',
    sortOrder: category?.sortOrder ?? defaultSortOrder,
    isActive: category?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});

  function handleChange<K extends keyof CategoryFormData>(
    field: K,
    value: CategoryFormData[K]
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof CategoryFormData;
        if (!fieldErrors[field]) fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  function toCreateData(): CreateCategoryData {
    return {
      restaurantId,
      name: data.name,
      description: data.description || undefined,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    };
  }

  function toUpdateData(): UpdateCategoryData {
    return {
      name: data.name,
      description: data.description || undefined,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    };
  }

  return { data, errors, handleChange, validate, toCreateData, toUpdateData, isEditing };
}
