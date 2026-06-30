'use client';

import { useState } from 'react';
import { ShoppingBag, Wifi } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { useOrderStatuses } from '@/features/order-statuses/hooks/useOrderStatuses';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

import { useOrders } from '../../hooks/useOrders';
import { OrderCard } from '../OrderCard';
import { OrderDetailModal } from '../OrderDetailModal';

const ALL_TAB = '__all__';

export function OrdersManager() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId ?? '';

  const { orders, isLoading, error } = useOrders(restaurantId);
  const { data: statuses = [] } = useOrderStatuses(restaurantId);

  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusMap = new Map(statuses.map((s) => [s.id, s]));
  const activeStatuses = statuses.filter((s) => s.isActive);

  const filtered =
    activeTab === ALL_TAB ? orders : orders.filter((o) => o.statusId === activeTab);

  const countByStatus = (statusId: string) =>
    orders.filter((o) => o.statusId === statusId).length;

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

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        Error al cargar los pedidos.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              <Wifi className="h-3 w-3" />
              En vivo
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
          </p>
        </div>
      </div>

      {/* Tabs de estado */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1">
        <button
          onClick={() => setActiveTab(ALL_TAB)}
          className={cn(
            'flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === ALL_TAB
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Todos ({orders.length})
        </button>
        {activeStatuses.map((status) => (
          <button
            key={status.id}
            onClick={() => setActiveTab(status.id)}
            className={cn(
              'flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === status.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              {status.name}
              {countByStatus(status.id) > 0 && (
                <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-bold text-gray-700">
                  {countByStatus(status.id)}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Sin pedidos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === ALL_TAB
              ? 'Los pedidos aparecerán aquí en tiempo real.'
              : 'No hay pedidos con este estado.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              status={statusMap.get(order.statusId)}
              onOpen={setSelectedOrder}
            />
          ))}
        </div>
      )}

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
