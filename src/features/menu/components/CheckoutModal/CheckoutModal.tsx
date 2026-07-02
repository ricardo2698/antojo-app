'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { cartTotal, useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/lib/utils';

import { buildWhatsAppMessage, openWhatsApp } from '../../helpers/whatsapp.helpers';

const PAYMENT_METHODS = ['Efectivo', 'Transferencia', 'Nequi', 'Daviplata', 'Tarjeta'];

interface CheckoutModalProps {
  primaryColor: string;
}

export function CheckoutModal({ primaryColor }: CheckoutModalProps) {
  const items = useCartStore((s) => s.items);
  const restaurantPhone = useCartStore((s) => s.restaurantPhone);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const isCheckoutOpen = useCartStore((s) => s.isCheckoutOpen);
  const setCheckoutOpen = useCartStore((s) => s.setCheckoutOpen);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore(cartTotal);

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    paymentMethod: 'Efectivo',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  if (!isCheckoutOpen) return null;

  function validate(): boolean {
    const newErrors: Partial<typeof form> = {};
    if (!form.customerName.trim()) newErrors.customerName = 'El nombre es requerido';
    if (!form.customerPhone.trim()) newErrors.customerPhone = 'El teléfono es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const message = buildWhatsAppMessage(restaurantName, items, total, form);
    openWhatsApp(restaurantPhone, message);
    clearCart();
    setCheckoutOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => setCheckoutOpen(false)} />

      <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Datos de tu pedido</h2>
          <button onClick={() => setCheckoutOpen(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Resumen */}
        <div className="flex-shrink-0 border-b border-gray-100 bg-gray-50 px-5 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {items.length} ítem{items.length !== 1 ? 's' : ''}
            </p>
            <p className="font-bold text-gray-900">{formatCurrency(total)}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 p-5">
            <Input
              label="Tu nombre"
              value={form.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              error={errors.customerName}
              placeholder="Juan García"
              required
            />
            <Input
              label="Tu teléfono"
              type="tel"
              value={form.customerPhone}
              onChange={(e) => handleChange('customerPhone', e.target.value)}
              error={errors.customerPhone}
              placeholder="+57 300 000 0000"
              required
            />
            <Input
              label="Dirección de entrega"
              value={form.customerAddress}
              onChange={(e) => handleChange('customerAddress', e.target.value)}
              placeholder="Opcional — si es a domicilio"
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Método de pago</label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handleChange('paymentMethod', method)}
                    className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors"
                    style={
                      form.paymentMethod === method
                        ? { backgroundColor: primaryColor, borderColor: primaryColor, color: 'white' }
                        : { borderColor: '#d1d5db', color: '#374151' }
                    }
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Notas</label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Sin cebolla, extra napolitana..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
              />
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-gray-100 p-5">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar pedido por WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
