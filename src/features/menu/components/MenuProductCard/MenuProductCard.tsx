'use client';

import Image from 'next/image';
import { Plus, Package } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

interface MenuProductCardProps {
  product: Product;
  primaryColor: string;
  onSelect: (product: Product) => void;
}

export function MenuProductCard({ product, primaryColor, onSelect }: MenuProductCardProps) {
  const { name, description, price, image, tag, isAvailable, additionals } = product;

  return (
    <button
      onClick={() => isAvailable && onSelect(product)}
      disabled={!isAvailable}
      className="group flex w-full gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      {/* Imagen */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-7 w-7 text-gray-300" />
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded bg-white/90 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-semibold text-gray-900">{name}</p>
              {tag && (
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {tag}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{description}</p>
            )}
            {additionals.length > 0 && (
              <p className="mt-0.5 text-xs text-gray-400">
                + {additionals.length} opcional{additionals.length !== 1 ? 'es' : ''}
              </p>
            )}
          </div>

          <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
            <span className="font-bold text-gray-900">{formatCurrency(price)}</span>
            {isAvailable && (
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm transition-transform group-hover:scale-110"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
