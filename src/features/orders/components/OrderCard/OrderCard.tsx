'use client';

import { Clock, MapPin, MessageCircle } from 'lucide-react';

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

function formatShortDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) +
    ' · ' +
    d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export function OrderCard({ order, status, onOpen }: OrderCardProps) {
  const {
    orderNumber,
    customerName,
    customerPhone,
    customerAddress,
    items,
    subtotal,
    total,
    paymentMethod,
    createdAt,
  } = order;

  const whatsappUrl = `https://wa.me/${customerPhone.replace(/\D/g, '')}`;

  return (
    <div
      onClick={() => onOpen(order)}
      className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Header: número + estado */}
      <div className="flex items-center justify-between gap-2 mb-3">
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

      {/* Tiempo */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
        <Clock className="h-3 w-3" />
        <span>{timeAgo(createdAt)}</span>
        <span>·</span>
        <span>{formatShortDate(createdAt)}</span>
      </div>

      {/* Items */}
      <div className="space-y-1 mb-3">
        {items.slice(0, 3).map((item, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-gray-800">
                {item.productName} <span className="text-gray-500">×{item.quantity}</span>
              </span>
              <span className="text-gray-700 font-medium ml-2 flex-shrink-0">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
            {item.additionals.length > 0 && (
              <div className="ml-3 mt-0.5 space-y-0.5">
                {item.additionals.map((a, j) => (
                  <div key={j} className="flex justify-between text-xs text-gray-400">
                    <span>↳ {a.name}</span>
                    <span>+{formatCurrency(a.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-xs text-gray-400">+{items.length - 3} más...</p>
        )}
      </div>

      {/* Totales */}
      <div className="space-y-1 border-t border-gray-100 pt-2 mb-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Total productos</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Cliente */}
      <div className="space-y-1.5 border-t border-gray-100 pt-2 text-sm">
        <p className="font-semibold text-gray-900">{customerName}</p>
        <p className="text-xs text-gray-500">{paymentMethod}</p>
        {customerAddress && (
          <p className="flex items-start gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{customerAddress}</span>
          </p>
        )}
      </div>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <MessageCircle className="h-4 w-4" />
        {customerPhone}
      </a>
    </div>
  );
}
