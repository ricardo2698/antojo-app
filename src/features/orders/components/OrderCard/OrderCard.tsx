'use client';

import { Phone, MapPin, Clock } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';

import type { OrderCardProps } from './OrderCard.types';

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'hace un momento';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

export function OrderCard({ order, status, onOpen }: OrderCardProps) {
  const {
    orderNumber,
    customerName,
    customerPhone,
    customerAddress,
    items,
    total,
    paymentMethod,
    createdAt,
  } = order;

  return (
    <button
      onClick={() => onOpen(order)}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-orange-300 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-gray-900">{orderNumber}</span>
            {status && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: status.color }}
              >
                {status.name}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-base font-semibold text-gray-900">{customerName}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {timeAgo(createdAt)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 space-y-1">
        <p className="flex items-center gap-1.5 text-sm text-gray-500">
          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
          {customerPhone}
        </p>
        {customerAddress && (
          <p className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{customerAddress}</span>
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
        <span className="text-xs text-gray-400">
          {items.length} ítem{items.length !== 1 ? 's' : ''} · {paymentMethod}
        </span>
        <span className="text-xs font-medium text-orange-600">Ver detalle →</span>
      </div>
    </button>
  );
}
