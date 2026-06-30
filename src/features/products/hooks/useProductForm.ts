import { useState } from 'react';
import { z } from 'zod';

import type { Product, CreateProductData, UpdateProductData, Additional } from '@/types';

import type { ProductFormData } from '../types/product.types';

const schema = z.object({
  categoryId: z.string().min(1, 'Seleccioná una categoría'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  sortOrder: z.number().int().min(1, 'Debe ser mayor a 0'),
});

const defaultValues: ProductFormData = {
  categoryId: '',
  name: '',
  description: '',
  price: 0,
  image: '',
  tag: '',
  additionals: [],
  isActive: true,
  isAvailable: true,
  sortOrder: 1,
};

export function useProductForm(
  restaurantId: string,
  product?: Product,
  defaultSortOrder = 1
) {
  const isEditing = !!product;

  const [data, setData] = useState<ProductFormData>(() => {
    if (!product) return { ...defaultValues, sortOrder: defaultSortOrder };
    return {
      categoryId: product.categoryId,
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      image: product.image ?? '',
      tag: product.tag ?? '',
      additionals: product.additionals,
      isActive: product.isActive,
      isAvailable: product.isAvailable,
      sortOrder: product.sortOrder,
    };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  function handleChange<K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function addAdditional() {
    setData((prev) => ({
      ...prev,
      additionals: [...prev.additionals, { name: '', price: 0 }],
    }));
  }

  function updateAdditional(index: number, field: keyof Additional, value: string | number) {
    setData((prev) => ({
      ...prev,
      additionals: prev.additionals.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      ),
    }));
  }

  function removeAdditional(index: number) {
    setData((prev) => ({
      ...prev,
      additionals: prev.additionals.filter((_, i) => i !== index),
    }));
  }

  function validate(): boolean {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof ProductFormData;
        if (!fieldErrors[field]) fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  function toCreateData(): CreateProductData {
    return {
      restaurantId,
      categoryId: data.categoryId,
      name: data.name,
      description: data.description || undefined,
      price: data.price,
      image: data.image || undefined,
      tag: data.tag || undefined,
      additionals: data.additionals.filter((a) => a.name.trim()),
      isActive: data.isActive,
      isAvailable: data.isAvailable,
      sortOrder: data.sortOrder,
    };
  }

  function toUpdateData(): UpdateProductData {
    return {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description || undefined,
      price: data.price,
      image: data.image || undefined,
      tag: data.tag || undefined,
      additionals: data.additionals.filter((a) => a.name.trim()),
      isActive: data.isActive,
      isAvailable: data.isAvailable,
      sortOrder: data.sortOrder,
    };
  }

  return {
    data,
    errors,
    handleChange,
    addAdditional,
    updateAdditional,
    removeAdditional,
    validate,
    toCreateData,
    toUpdateData,
    isEditing,
  };
}
