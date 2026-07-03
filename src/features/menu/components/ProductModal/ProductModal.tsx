'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import type { Adicional, Additional, Product } from '@/types';

const sg = "var(--font-space-grotesk, 'Inter', sans-serif)";
const sm = "var(--font-space-mono, monospace)";

interface ProductModalProps {
  product: Product | null;
  adicionales: Adicional[];
  primaryColor: string;
  onClose: () => void;
}

export function ProductModal({ product, adicionales, primaryColor, onClose }: ProductModalProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [selectedAdditionals, setSelectedAdditionals] = useState<Additional[]>([]);
  const [sinAdicionales, setSinAdicionales] = useState(true);
  const [instructions, setInstructions] = useState('');

  if (!product) return null;

  const productAdicionales = adicionales.filter((a) => product.adicionalIds?.includes(a.id));
  const additionalsTotal = selectedAdditionals.reduce((acc, a) => acc + a.price, 0);
  const grandTotal = product.price + additionalsTotal;

  function toggleAdditional(adicional: Adicional) {
    setSinAdicionales(false);
    const asAdditional: Additional = { name: adicional.name, price: adicional.price };
    setSelectedAdditionals((prev) => {
      const exists = prev.some((a) => a.name === adicional.name);
      return exists ? prev.filter((a) => a.name !== adicional.name) : [...prev, asAdditional];
    });
  }

  function selectSinAdicionales() {
    setSinAdicionales(true);
    setSelectedAdditionals([]);
  }

  function handleAdd() {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price,
      additionals: selectedAdditionals,
      specialInstructions: instructions,
    });
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 480,
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: '24px 24px 0 0',
        overflow: 'hidden',
        boxShadow: '0 -8px 40px rgba(0,0,0,.18)',
      }}>
        {/* Image header */}
        <div style={{ position: 'relative', height: 220, flexShrink: 0, background: '#f0ece7' }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#d0c8be" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.1) 55%, transparent 100%)',
          }} />

          {/* Name + price overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px' }}>
            <div style={{ fontFamily: sg, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-.01em', textTransform: 'uppercase' }}>
              {product.name}
            </div>
            <div style={{ fontFamily: sg, fontSize: 13, color: 'rgba(255,255,255,.8)', marginTop: 2 }}>
              Base: {formatCurrency(product.price)}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(0,0,0,.45)', border: 'none',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}
          >
            <X size={16} color="#fff" />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>

          {/* Adicionales section */}
          {productAdicionales.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: sm, fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
                color: '#9a8f86', textTransform: 'uppercase', marginBottom: 12,
              }}>
                Elegí tus adicionales
              </div>

              {/* Sin adicionales */}
              <button
                type="button"
                onClick={selectSinAdicionales}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 14, border: `2px solid ${sinAdicionales ? '#2C7A52' : '#e5e7eb'}`,
                  background: sinAdicionales ? '#f0faf4' : '#fff',
                  cursor: 'pointer', fontFamily: sg, marginBottom: 8, textAlign: 'left',
                  transition: 'border-color .15s, background .15s',
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${sinAdicionales ? '#2C7A52' : '#d1d5db'}`,
                  background: sinAdicionales ? '#2C7A52' : 'transparent',
                  display: 'grid', placeItems: 'center',
                  transition: 'all .15s',
                }}>
                  {sinAdicionales && (
                    <svg viewBox="0 0 10 8" width="10" height="8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: sinAdicionales ? '#2C7A52' : '#374151' }}>
                  Sin adicionales
                </span>
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0 8px' }}>
                <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                <span style={{ fontFamily: sm, fontSize: 11, color: '#9a8f86', flexShrink: 0 }}>o elegí</span>
                <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              </div>

              {/* Adicional rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {productAdicionales.map((adicional) => {
                  const checked = selectedAdditionals.some((a) => a.name === adicional.name);
                  return (
                    <button
                      key={adicional.id}
                      type="button"
                      onClick={() => toggleAdditional(adicional)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', borderRadius: 14,
                        border: `2px solid ${checked ? '#2C7A52' : '#e5e7eb'}`,
                        background: checked ? '#f0faf4' : '#fff',
                        cursor: 'pointer', textAlign: 'left', fontFamily: sg,
                        transition: 'border-color .15s, background .15s',
                      }}
                    >
                      <span style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${checked ? '#2C7A52' : '#d1d5db'}`,
                        background: checked ? '#2C7A52' : 'transparent',
                        display: 'grid', placeItems: 'center',
                        transition: 'all .15s',
                      }}>
                        {checked && (
                          <svg viewBox="0 0 10 8" width="10" height="8" fill="none">
                            <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: checked ? '#2C7A52' : '#374151' }}>
                        {adicional.name}
                      </span>
                      <span style={{ fontFamily: sm, fontSize: 13, fontWeight: 700, color: primaryColor, flexShrink: 0 }}>
                        +{formatCurrency(adicional.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Total */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0', borderTop: '1px solid #f3f4f6',
          }}>
            <span style={{ fontFamily: sg, fontSize: 14, color: '#6b7280' }}>Total</span>
            <span style={{ fontFamily: sg, fontWeight: 800, fontSize: 18, color: '#1B1512' }}>
              {formatCurrency(grandTotal)}
            </span>
          </div>

          {/* Indicación especial */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontFamily: sm, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: '#9a8f86', marginBottom: 8 }}>
              ¿ALGUNA INDICACIÓN ESPECIAL?
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ej: sin leche condensada, poco azúcar..."
              rows={2}
              style={{
                width: '100%', borderRadius: 12, border: '1.5px solid #e5e7eb',
                padding: '10px 12px', fontFamily: sg, fontSize: 13, color: '#1B1512',
                resize: 'none', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, padding: '12px 16px 20px', borderTop: '1px solid #f3f4f6', background: '#fff' }}>
          <button
            onClick={handleAdd}
            style={{
              width: '100%', padding: '15px 18px', borderRadius: 14, border: 'none',
              background: primaryColor, color: '#fff', cursor: 'pointer',
              fontFamily: sg, fontWeight: 700, fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Agregar al pedido
          </button>
        </div>
      </div>
    </div>
  );
}
