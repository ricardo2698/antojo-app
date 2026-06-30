'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Package } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import type { Additional, Product } from '@/types';

interface ProductModalProps {
  product: Product | null;
  primaryColor: string;
  onClose: () => void;
}

export function ProductModal({ product, primaryColor, onClose }: ProductModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);

  const [quantity, setQuantity] = useState(1);
  const [selectedAdditionals, setSelectedAdditionals] = useState<Additional[]>([]);
  const [instructions, setInstructions] = useState('');

  if (!product) return null;

  const additionalsTotal = selectedAdditionals.reduce((acc, a) => acc + a.price, 0);
  const unitTotal = product.price + additionalsTotal;
  const grandTotal = unitTotal * quantity;

  function toggleAdditional(additional: Additional) {
    setSelectedAdditionals((prev) => {
      const exists = prev.some((a) => a.name === additional.name);
      return exists ? prev.filter((a) => a.name !== additional.name) : [...prev, additional];
    });
  }

  function handleAdd() {
    addItem({
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      additionals: selectedAdditionals,
      specialInstructions: instructions,
    });
    onClose();
    setCartOpen(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">
        {/* Imagen */}
        <div className="relative h-48 w-full flex-shrink-0 bg-gray-100">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-16 w-16 text-gray-200" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow-sm"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            {product.description && (
              <p className="mt-1 text-sm text-gray-500">{product.description}</p>
            )}
            <p className="mt-2 text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
          </div>

          {/* Adicionales */}
          {product.additionals.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Adicionales opcionales</h3>
              <div className="space-y-1.5">
                {product.additionals.map((additional) => {
                  const checked = selectedAdditionals.some((a) => a.name === additional.name);
                  return (
                    <label
                      key={additional.name}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAdditional(additional)}
                          className="h-4 w-4 rounded"
                          style={{ accentColor: primaryColor }}
                        />
                        <span className="text-sm text-gray-700">{additional.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        +{formatCurrency(additional.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          )}

          {/* Instrucciones */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">
              Instrucciones especiales
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Sin cebolla, extra salsa..."
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
            />
          </div>
        </div>

        {/* Footer: cantidad + agregar */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white p-4">
          <div className="flex items-center gap-4">
            {/* Cantidad */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-semibold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Agregar */}
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-between rounded-xl px-4 py-3 font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Agregar al carrito</span>
              <span>{formatCurrency(grandTotal)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
