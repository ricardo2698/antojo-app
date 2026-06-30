'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

import { cartItemCount, useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/lib/utils';
import { cartTotal } from '@/store/cart.store';
import type { Category, Product, Restaurant } from '@/types';

import { CartDrawer } from '../CartDrawer';
import { CategoryTabs } from '../CategoryTabs';
import { CheckoutModal } from '../CheckoutModal';
import { MenuHeader } from '../MenuHeader';
import { MenuProductCard } from '../MenuProductCard';
import { ProductModal } from '../ProductModal';

interface MenuPageProps {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
}

export function MenuPage({ restaurant, categories, products }: MenuPageProps) {
  const initCart = useCartStore((s) => s.initCart);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const count = useCartStore(cartItemCount);
  const total = useCartStore(cartTotal);

  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { primaryColor } = restaurant.theme;

  useEffect(() => {
    initCart(restaurant.id, restaurant.phone, restaurant.name);
  }, [restaurant.id, restaurant.phone, restaurant.name, initCart]);

  const visibleProducts = products.filter((p) => p.categoryId === activeCategoryId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del restaurante */}
      <MenuHeader restaurant={restaurant} />

      {/* Tabs de categorías */}
      {categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          activeId={activeCategoryId}
          primaryColor={primaryColor}
          onSelect={setActiveCategoryId}
        />
      )}

      {/* Grid de productos */}
      <main className="mx-auto max-w-2xl px-4 py-5">
        {visibleProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400">Sin productos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {visibleProducts.map((product) => (
              <MenuProductCard
                key={product.id}
                product={product}
                primaryColor={primaryColor}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB del carrito */}
      {count > 0 && (
        <div className="fixed bottom-5 left-0 right-0 z-30 flex justify-center px-4">
          <button
            onClick={() => setCartOpen(true)}
            className="flex w-full max-w-sm items-center justify-between rounded-2xl px-5 py-3.5 text-white shadow-xl transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span className="font-semibold">Ver carrito ({count})</span>
            </div>
            <span className="font-bold">{formatCurrency(total)}</span>
          </button>
        </div>
      )}

      {/* Modales */}
      <ProductModal
        product={selectedProduct}
        primaryColor={primaryColor}
        onClose={() => setSelectedProduct(null)}
      />
      <CartDrawer primaryColor={primaryColor} />
      <CheckoutModal primaryColor={primaryColor} />
    </div>
  );
}
