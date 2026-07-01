'use client';

import { useState } from 'react';
import { Phone, MapPin, MessageSquare, CreditCard } from 'lucide-react';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatDate } from '@/lib/utils';

import { useUpdateOrderStatus } from '../../hooks/useUpdateOrderStatus';
import type { OrderDetailModalProps } from './OrderDetailModal.types';

export function OrderDetailModal({
  order,
  statuses,
  restaurantId,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  const { updateStatus, isPending, error } = useUpdateOrderStatus(restaurantId);
  const [selectedStatusId, setSelectedStatusId] = useState<string>('');

  const activeStatuses = statuses.filter((s) => s.isActive);
  const currentStatus = statuses.find((s) => s.id === order?.statusId);

  async function handleStatusUpdate() {
    if (!order || !selectedStatusId || selectedStatusId === order.statusId) return;
    await updateStatus(order.id, selectedStatusId);
    setSelectedStatusId('');
  }

  function handleWhatsApp() {
    if (!order) return;
    const newStatus = statuses.find((s) => s.id === selectedStatusId);
    const msg = encodeURIComponent(
      `Hola ${order.customerName}! Tu pedido ${order.orderNumber} está ahora en estado: *${newStatus?.name ?? currentStatus?.name}* 🍽️`
    );
    window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${msg}`, '_blank');
  }

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pedido ${order.orderNumber}`}
      description={formatDate(order.createdAt)}
      size="lg"
    >
      <div className="space-y-5 p-6">
        {/* Cliente */}
        <section className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Cliente</h3>
          <p className="text-base font-semibold text-gray-900">{order.customerName}</p>
          <p className="flex items-center gap-1.5 text-sm text-gray-600">
            <Phone className="h-3.5 w-3.5" />
            {order.customerPhone}
          </p>
          {order.customerAddress && (
            <p className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="h-3.5 w-3.5" />
              {order.customerAddress}
            </p>
          )}
          <p className="flex items-center gap-1.5 text-sm text-gray-600">
            <CreditCard className="h-3.5 w-3.5" />
            {order.paymentMethod}
          </p>
        </section>

        {/* Items */}
        <section className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Ítems del pedido
          </h3>
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
            {order.items.map((item, i) => (
              <div key={i} className="px-4 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {item.quantity}× {item.productName}
                    </p>
                    {item.additionals.length > 0 && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        + {item.additionals.map((a) => a.name).join(', ')}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="mt-0.5 text-xs italic text-gray-400">
                        "{item.specialInstructions}"
                      </p>
                    )}
                  </div>
                  <p className="flex-shrink-0 text-sm font-semibold text-gray-900">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-base font-bold text-gray-900">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>

        {/* Notas */}
        {order.notes && (
          <section className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notas</h3>
            <p className="flex items-start gap-1.5 text-sm text-gray-600">
              <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              {order.notes}
            </p>
          </section>
        )}

        {/* Estado */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Estado del pedido
          </h3>

          {currentStatus && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Actual:</span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: currentStatus.color }}
              >
                {currentStatus.name}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <Select
              value={selectedStatusId}
              onChange={setSelectedStatusId}
              disabled={isPending}
              placeholder="Cambiar a..."
              options={activeStatuses
                .filter((s) => s.id !== order.statusId)
                .map((s) => ({ value: s.id, label: s.name }))}
              style={{ flex: 1 }}
            />

            <Button
              onClick={handleStatusUpdate}
              disabled={!selectedStatusId || selectedStatusId === order.statusId}
              isLoading={isPending}
            >
              Actualizar
            </Button>
          </div>

          {selectedStatusId && (
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-300 bg-green-50 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Notificar por WhatsApp
            </button>
          )}

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
        </section>
      </div>
    </Modal>
  );
}
