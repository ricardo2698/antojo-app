'use client';

import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { cartItemCount, cartTotal, useCartStore } from '@/store/cart.store';

interface CartDrawerProps {
  primaryColor: string;
}

export function CartDrawer({ primaryColor }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const setCheckoutOpen = useCartStore((s) => s.setCheckoutOpen);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore(cartTotal);
  const count = useCartStore(cartItemCount);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />

      <aside className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
            <h2 className="font-semibold text-gray-900">Tu pedido</h2>
            {count > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {count}
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-200" />
              <p className="text-sm text-gray-400">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.cartId} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{item.productName}</p>
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
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="flex-shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-600"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex-shrink-0 space-y-3 border-t border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
            </div>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full rounded-xl py-3.5 font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Hacer pedido por WhatsApp
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
