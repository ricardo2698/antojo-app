import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { categoriesService } from '@/features/categories/services/categories.service';
import { adicionalesService } from '@/features/adicionales/services/adicionales.service';
import { MenuPage } from '@/features/menu/components/MenuPage';
import { productsService } from '@/features/products/services/products.service';
import { restaurantsService } from '@/features/restaurants/services/restaurants.service';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const restaurant = await restaurantsService.getBySlug(params.slug);
  if (!restaurant) return { title: 'Restaurante no encontrado' };
  return {
    title: restaurant.name,
    description: restaurant.description,
  };
}

export default async function RestaurantMenuPage({ params }: Props) {
  const restaurant = await restaurantsService.getBySlug(params.slug);

  if (!restaurant || !restaurant.isActive) {
    notFound();
  }

  const [categories, products, adicionales] = await Promise.all([
    categoriesService.getAll(restaurant.id),
    productsService.getAll(restaurant.id),
    adicionalesService.getAll(restaurant.id),
  ]);

  const activeCategories = categories.filter((c) => c.isActive);
  const activeProducts = products.filter((p) => p.isActive);
  const activeAdicionales = adicionales.filter((a) => a.isActive);

  return (
    <MenuPage
      restaurant={restaurant}
      categories={activeCategories}
      products={activeProducts}
      adicionales={activeAdicionales}
    />
  );
}
