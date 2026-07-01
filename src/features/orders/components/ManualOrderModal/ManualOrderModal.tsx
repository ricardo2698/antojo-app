'use client';

import { useState, useMemo } from 'react';
import { X, Plus, Minus, Trash2, Search } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import type { Product, Adicional, OrderItem, Additional } from '@/types';

import { ordersService } from '../../services/orders.service';

interface ManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  receivedStatusId: string;
  products: Product[];
  adicionales: Adicional[];
}

interface CartLine {
  product: Product;
  quantity: number;
  selectedAdicionales: Adicional[];
}

const PAYMENT_METHODS = ['Efectivo', 'Transferencia', 'Tarjeta débito', 'Tarjeta crédito', 'Nequi', 'Daviplata'];

export function ManualOrderModal({
  isOpen,
  onClose,
  restaurantId,
  receivedStatusId,
  products,
  adicionales,
}: ManualOrderModalProps) {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'recoger' | 'domicilio'>('recoger');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [notes, setNotes] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const activeProducts = useMemo(
    () => products.filter((p) => p.isActive && p.isAvailable),
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return activeProducts;
    const q = search.toLowerCase();
    return activeProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [activeProducts, search]);

  const adicionalesMap = useMemo(
    () => Object.fromEntries(adicionales.map((a) => [a.id, a])),
    [adicionales]
  );

  function getProductAdicionales(product: Product): Adicional[] {
    return product.adicionalIds
      .map((id) => adicionalesMap[id])
      .filter(Boolean)
      .filter((a) => a.isActive);
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.findIndex((l) => l.product.id === product.id);
      if (existing !== -1) {
        return prev.map((l, i) =>
          i === existing ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...prev, { product, quantity: 1, selectedAdicionales: [] }];
    });
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) =>
          l.product.id === productId ? { ...l, quantity: l.quantity + delta } : l
        )
        .filter((l) => l.quantity > 0)
    );
  }

  function toggleAdicional(productId: string, adicional: Adicional) {
    setCart((prev) =>
      prev.map((l) => {
        if (l.product.id !== productId) return l;
        const exists = l.selectedAdicionales.some((a) => a.id === adicional.id);
        return {
          ...l,
          selectedAdicionales: exists
            ? l.selectedAdicionales.filter((a) => a.id !== adicional.id)
            : [...l.selectedAdicionales, adicional],
        };
      })
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((l) => l.product.id !== productId));
  }

  const subtotal = cart.reduce((sum, l) => {
    const addPrice = l.selectedAdicionales.reduce((s, a) => s + a.price, 0);
    return sum + (l.product.price + addPrice) * l.quantity;
  }, 0);

  const total = subtotal + (deliveryType === 'domicilio' ? 0 : 0); // delivery fee could be added here

  async function handleSubmit() {
    if (!customerName.trim()) { setError('El nombre del cliente es requerido'); return; }
    if (!customerPhone.trim()) { setError('El teléfono es requerido'); return; }
    if (cart.length === 0) { setError('Agregá al menos un producto'); return; }
    if (deliveryType === 'domicilio' && !address.trim()) { setError('La dirección es requerida para domicilio'); return; }

    setError('');
    setIsSaving(true);

    try {
      const items: OrderItem[] = cart.map((l) => {
        const addPrice = l.selectedAdicionales.reduce((s, a) => s + a.price, 0);
        const unitPrice = l.product.price + addPrice;
        const additionals: Additional[] = l.selectedAdicionales.map((a) => ({
          name: a.name,
          price: a.price,
        }));
        return {
          productId: l.product.id,
          productName: l.product.name,
          quantity: l.quantity,
          unitPrice,
          subtotal: unitPrice * l.quantity,
          additionals,
        };
      });

      await ordersService.create({
        restaurantId,
        statusId: receivedStatusId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        ...(deliveryType === 'domicilio' && address.trim() ? { customerAddress: address.trim() } : {}),
        paymentMethod,
        items,
        subtotal,
        total,
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });

      // Reset form
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryType('recoger');
      setAddress('');
      setPaymentMethod('Efectivo');
      setNotes('');
      setSearch('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el pedido');
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 flex flex-col w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[90vh] bg-white sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Nuevo pedido manual</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          {/* Left: product selector */}
          <div className="flex flex-col sm:w-1/2 border-b sm:border-b-0 sm:border-r border-gray-100 overflow-hidden" style={{ maxHeight: '40vh', flexShrink: 0 }} /* mobile constraint */>
            <div className="px-4 pt-3 pb-2 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-orange-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 px-4 pb-3 space-y-1">
              {filteredProducts.map((product) => {
                const inCart = cart.find((l) => l.product.id === product.id);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 p-2.5 hover:border-orange-200 hover:bg-orange-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                    </div>
                    {inCart ? (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => updateQty(product.id, -1)}
                          className="h-6 w-6 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-bold text-gray-900 w-5 text-center">{inCart.quantity}</span>
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          className="h-6 w-6 rounded-lg border border-orange-400 bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="h-7 w-7 flex-shrink-0 rounded-lg bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-400">Sin productos</p>
              )}
            </div>
          </div>

          {/* Right: cart + customer data */}
          <div className="flex flex-col sm:w-1/2 overflow-y-auto">
            {/* Cart items */}
            {cart.length > 0 && (
              <div className="px-4 pt-3 pb-2 space-y-2 border-b border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Productos</p>
                {cart.map((line) => {
                  const avail = getProductAdicionales(line.product);
                  const lineAddPrice = line.selectedAdicionales.reduce((s, a) => s + a.price, 0);
                  const lineTotal = (line.product.price + lineAddPrice) * line.quantity;
                  return (
                    <div key={line.product.id} className="rounded-xl border border-gray-100 p-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {line.product.name} <span className="text-gray-500 font-normal">×{line.quantity}</span>
                          </p>
                          <p className="text-xs text-gray-500">{formatCurrency(lineTotal)}</p>
                        </div>
                        <button onClick={() => removeFromCart(line.product.id)} className="text-gray-300 hover:text-red-400 flex-shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {avail.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {avail.map((a) => {
                            const active = line.selectedAdicionales.some((s) => s.id === a.id);
                            return (
                              <button
                                key={a.id}
                                onClick={() => toggleAdicional(line.product.id, a)}
                                className={`rounded-lg px-2 py-0.5 text-xs font-medium border transition-colors ${
                                  active
                                    ? 'bg-orange-500 border-orange-500 text-white'
                                    : 'border-gray-200 text-gray-600 hover:border-orange-300'
                                }`}
                              >
                                +{a.name} {formatCurrency(a.price)}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Customer data */}
            <div className="px-4 pt-3 pb-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Cliente</p>

              <input
                type="text"
                placeholder="Nombre del cliente *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Teléfono *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
              />

              {/* Delivery type */}
              <div className="flex gap-2">
                {(['recoger', 'domicilio'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDeliveryType(type)}
                    className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${
                      deliveryType === type
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {type === 'recoger' ? 'Recoger' : 'Domicilio'}
                  </button>
                ))}
              </div>

              {deliveryType === 'domicilio' && (
                <input
                  type="text"
                  placeholder="Dirección *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
                />
              )}

              {/* Payment method */}
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none bg-white"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <textarea
                placeholder="Notas (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-3">
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <div className="flex items-center justify-between text-sm font-bold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving || cart.length === 0}
            className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando...' : 'Crear pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
