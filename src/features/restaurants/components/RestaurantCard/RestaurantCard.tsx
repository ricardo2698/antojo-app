'use client';

import Image from 'next/image';
import { Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

import type { RestaurantCardProps } from './RestaurantCard.types';

export function RestaurantCard({
  restaurant,
  onEdit,
  onToggleActive,
  onDelete,
  isToggling,
  isDeleting,
}: RestaurantCardProps) {
  const { id, name, slug, description, phone, logo, isActive, theme } = restaurant;

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Logo / header */}
      <div className="relative h-32 w-full overflow-hidden rounded-t-xl bg-gray-100">
        {logo ? (
          <Image src={logo} alt={name} fill className="object-cover" />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: theme.primaryColor }}
          />
        )}
        <div className="absolute right-2 top-2">
          <Badge variant={isActive ? 'success' : 'danger'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-orange-600">
            <ExternalLink className="h-3 w-3" />
            /{slug}
          </p>
        </div>

        <p className="line-clamp-2 text-sm text-gray-500">{description}</p>

        <p className="text-xs text-gray-400">{phone}</p>

        {/* Theme colors */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">Tema:</span>
          {[theme.primaryColor, theme.secondaryColor, theme.accentColor].map((color, i) => (
            <span
              key={i}
              className="h-4 w-4 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-gray-100 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleActive(id, !isActive)}
          isLoading={isToggling}
          className="flex-1"
        >
          {isActive ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Desactivar
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Activar
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(restaurant)}
          className="flex-1"
        >
          <Edit className="h-3.5 w-3.5" />
          Editar
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(id, name)}
          isLoading={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </article>
  );
}
