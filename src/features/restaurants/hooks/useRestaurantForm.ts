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
  tagline: '',
  description: '',
  phone: '',
  logo: '',
  bannerImage: '',
  primaryColor: '#FF6A1A',
  secondaryColor: '#1B1512',
  accentColor: '#FFE0CC',
  bgColor: '#FBF3EF',
  isActive: true,
  address: '',
  city: '',
  mapUrl: '',
  mapEmbed: '',
  instagram: '',
  facebook: '',
  menuLayout: 'cards',
  deliveryMode: 'manual',
  adminName: '',
  adminEmail: '',
  adminPassword: '',
};

function extractEmbedUrl(value: string): string {
  const match = value.match(/src=["'\u201c\u201d]([^"'\u201c\u201d]+)["'\u201c\u201d]/);
  return match ? match[1] : value;
}

export function useRestaurantForm(restaurant?: Restaurant) {
  const isEditing = !!restaurant;

  const [data, setData] = useState<RestaurantFormData>(() => {
    if (!restaurant) return defaultValues;
    return {
      name: restaurant.name,
      slug: restaurant.slug,
      tagline: restaurant.tagline ?? '',
      description: restaurant.description,
      phone: restaurant.phone,
      logo: restaurant.logo,
      bannerImage: restaurant.bannerImage ?? '',
      primaryColor: restaurant.theme.primaryColor,
      secondaryColor: restaurant.theme.secondaryColor,
      accentColor: restaurant.theme.accentColor,
      bgColor: restaurant.theme.bgColor ?? '#FBF3EF',
      isActive: restaurant.isActive,
      address: restaurant.address ?? '',
      city: restaurant.city ?? '',
      mapUrl: restaurant.mapUrl ?? '',
      mapEmbed: restaurant.mapEmbed ?? '',
      instagram: restaurant.instagram ?? '',
      facebook: restaurant.facebook ?? '',
      menuLayout: restaurant.menuLayout ?? 'cards',
      deliveryMode: restaurant.deliveryMode ?? 'manual',
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
      ...(data.tagline ? { tagline: data.tagline } : {}),
      description: data.description,
      phone: data.phone,
      logo: data.logo,
      ...(data.bannerImage ? { bannerImage: data.bannerImage } : {}),
      theme: {
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        bgColor: data.bgColor,
      },
      isActive: data.isActive,
      ...(data.address ? { address: data.address } : {}),
      ...(data.city ? { city: data.city } : {}),
      ...(data.mapUrl ? { mapUrl: data.mapUrl } : {}),
      ...(data.mapEmbed ? { mapEmbed: extractEmbedUrl(data.mapEmbed) } : {}),
      ...(data.instagram ? { instagram: data.instagram } : {}),
      ...(data.facebook ? { facebook: data.facebook } : {}),
      menuLayout: data.menuLayout,
      deliveryMode: data.deliveryMode,
      adminEmail: data.adminEmail,
      adminPassword: data.adminPassword,
      adminName: data.adminName,
    };
  }

  function toUpdateData(): UpdateRestaurantData {
    return {
      name: data.name,
      ...(data.tagline ? { tagline: data.tagline } : {}),
      description: data.description,
      phone: data.phone,
      logo: data.logo,
      ...(data.bannerImage ? { bannerImage: data.bannerImage } : {}),
      theme: {
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        bgColor: data.bgColor,
      },
      isActive: data.isActive,
      ...(data.address ? { address: data.address } : {}),
      ...(data.city ? { city: data.city } : {}),
      ...(data.mapUrl ? { mapUrl: data.mapUrl } : {}),
      ...(data.mapEmbed ? { mapEmbed: extractEmbedUrl(data.mapEmbed) } : {}),
      ...(data.instagram ? { instagram: data.instagram } : {}),
      ...(data.facebook ? { facebook: data.facebook } : {}),
      menuLayout: data.menuLayout,
      deliveryMode: data.deliveryMode,
    };
  }

  return { data, errors, handleChange, validate, toCreateData, toUpdateData, isEditing };
}
