'use client';

import Image from 'next/image';
import { Edit, Trash2, Package } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

import type { ProductCardProps } from './ProductCard.types';

export function ProductCard({
  product,
  category,
  onEdit,
  onToggleAvailable,
  onDelete,
  isToggling,
  isDeleting,
}: ProductCardProps) {
  const { id, name, description, price, image, tag, additionals, isActive, isAvailable, sortOrder } =
    product;

  return (
    <article className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Imagen */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-8 w-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-400">#{sortOrder}</span>
              <p className="font-medium text-gray-900 truncate">{name}</p>
              {tag && (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                  {tag}
                </span>
              )}
            </div>
            {category && (
              <p className="text-xs text-gray-400">{category.name}</p>
            )}
          </div>
          <p className="flex-shrink-0 font-bold text-gray-900">{formatCurrency(price)}</p>
        </div>

        {description && (
          <p className="line-clamp-1 text-xs text-gray-500">{description}</p>
        )}

        {additionals.length > 0 && (
          <p className="text-xs text-gray-400">
            {additionals.length} adicional{additionals.length !== 1 ? 'es' : ''}
          </p>
        )}

        {/* Badges y acciones */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {!isActive && <Badge variant="default">Inactivo</Badge>}
            <Badge variant={isAvailable ? 'success' : 'warning'}>
              {isAvailable ? 'Disponible' : 'No disponible'}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleAvailable(id, !isAvailable)}
              disabled={isToggling}
              className="rounded px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: isAvailable ? '#fef3c7' : '#d1fae5',
                color: isAvailable ? '#92400e' : '#065f46',
              }}
            >
              {isAvailable ? 'No disponible' : 'Disponible'}
            </button>

            <button
              onClick={() => onEdit(product)}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
              title="Editar"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onDelete(id, name)}
              disabled={isDeleting}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
