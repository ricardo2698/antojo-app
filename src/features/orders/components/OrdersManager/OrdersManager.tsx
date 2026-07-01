'use client';

import { useState } from 'react';
import { ShoppingBag, Wifi, RefreshCw } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { useOrderStatuses } from '@/features/order-statuses/hooks/useOrderStatuses';
import type { Order } from '@/types';

import { useOrders } from '../../hooks/useOrders';
import { OrderCard } from '../OrderCard';
import { OrderDetailModal } from '../OrderDetailModal';

type DateFilter = 'today' | 'month' | 'all';

function isToday(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isThisMonth(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function OrdersManager() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId ?? '';

  const { orders, isLoading } = useOrders(restaurantId);
  const { data: statuses = [] } = useOrderStatuses(restaurantId);

  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const activeStatuses = statuses
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const filteredOrders = orders.filter((o) => {
    if (dateFilter === 'today') return isToday(o.createdAt);
    if (dateFilter === 'month') return isThisMonth(o.createdAt);
    return true;
  });

  const ordersByStatus = (statusId: string) =>
    filteredOrders.filter((o) => o.statusId === statusId);

  if (!restaurantId) {
    return <p className="text-sm text-red-600">Tu cuenta no tiene un restaurante asignado.</p>;
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5 h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Pedidos en vivo</h2>
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              <Wifi className="h-3 w-3" />
              En vivo
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} activos
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refrescar
        </button>
      </div>

      {/* Filtros de fecha */}
      <div className="flex gap-2">
        {([
          { key: 'today', label: 'Hoy' },
          { key: 'month', label: 'Este mes' },
          { key: 'all', label: 'Todos' },
        ] as { key: DateFilter; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setDateFilter(key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              dateFilter === key
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
        {activeStatuses.map((status) => {
          const columnOrders = ordersByStatus(status.id);
          return (
            <div key={status.id} className="w-72 flex-shrink-0">
              {/* Column header */}
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="font-semibold text-gray-800">{status.name}</span>
                {columnOrders.length > 0 && (
                  <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-600">
                    {columnOrders.length}
                  </span>
                )}
              </div>

              {/* Column body */}
              <div
                className="min-h-24 rounded-2xl p-2 space-y-3"
                style={{ backgroundColor: `${status.color}18` }}
              >
                {columnOrders.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-sm text-gray-400">
                    <div className="text-center">
                      <ShoppingBag className="mx-auto mb-2 h-6 w-6 opacity-30" />
                      <span>Sin pedidos</span>
                    </div>
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      status={status}
                      onOpen={setSelectedOrder}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}

        {activeStatuses.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-16 text-center">
            <div>
              <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">No hay estados configurados.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      <OrderDetailModal
        order={selectedOrder}
        statuses={statuses}
        restaurantId={restaurantId}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
