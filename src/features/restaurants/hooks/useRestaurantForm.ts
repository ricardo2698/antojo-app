import { useState } from 'react';
import { z } from 'zod';

import { slugify } from '@/lib/utils';
import type { Restaurant, UpdateRestaurantData, CreateRestaurantData } from '@/types';

import type { RestaurantFormData } from '../types/restaurant.types';

const baseSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  slug: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  phone: z.string().min(7, 'Teléfono inválido'),
  logo: z.string().min(1, 'El logo es requerido'),
});

const createSchema = baseSchema.extend({
  adminName: z.string().min(2, 'Nombre requerido'),
  adminEmail: z.string().email('Email inválido'),
  adminPassword: z.string().min(6, 'Mínimo 6 caracteres'),
});

const defaultValues: RestaurantFormData = {
  name: '',
  slug: '',
  description: '',
  phone: '',
  logo: '',
  bannerImage: '',
  headerType: 'text',
  primaryColor: '#f97316',
  secondaryColor: '#1f2937',
  accentColor: '#fbbf24',
  isActive: true,
  adminName: '',
  adminEmail: '',
  adminPassword: '',
};

export function useRestaurantForm(restaurant?: Restaurant) {
  const isEditing = !!restaurant;

  const [data, setData] = useState<RestaurantFormData>(() => {
    if (!restaurant) return defaultValues;
    return {
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description,
      phone: restaurant.phone,
      logo: restaurant.logo,
      bannerImage: restaurant.bannerImage ?? '',
      headerType: restaurant.headerType,
      primaryColor: restaurant.theme.primaryColor,
      secondaryColor: restaurant.theme.secondaryColor,
      accentColor: restaurant.theme.accentColor,
      isActive: restaurant.isActive,
      adminName: '',
      adminEmail: '',
      adminPassword: '',
    };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RestaurantFormData, string>>>({});

  function handleChange<K extends keyof RestaurantFormData>(
    field: K,
    value: RestaurantFormData[K]
  ) {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !isEditing) {
        next.slug = slugify(value as string);
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const schema = isEditing ? baseSchema : createSchema;
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof RestaurantFormData;
        if (!fieldErrors[field]) fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  function toCreateData(): Omit<CreateRestaurantData, 'adminUserId'> {
    return {
      name: data.name,
      slug: data.slug,
      description: data.description,
      phone: data.phone,
      logo: data.logo,
      bannerImage: data.bannerImage || undefined,
      headerType: data.headerType,
      theme: {
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
      },
      isActive: data.isActive,
      adminEmail: data.adminEmail,
      adminPassword: data.adminPassword,
      adminName: data.adminName,
    };
  }

  function toUpdateData(): UpdateRestaurantData {
    return {
      name: data.name,
      description: data.description,
      phone: data.phone,
      logo: data.logo,
      bannerImage: data.bannerImage || undefined,
      headerType: data.headerType,
      theme: {
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
      },
      isActive: data.isActive,
    };
  }

  return { data, errors, handleChange, validate, toCreateData, toUpdateData, isEditing };
}
