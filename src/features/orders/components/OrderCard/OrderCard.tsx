'use client';

import { useState, useEffect } from 'react';
import {
  ArrowRight, Clock, MapPin, MessageCircle, Pencil, Bike,
  StickyNote, Check, X, XCircle,
} from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { ordersService } from '../../services/orders.service';
import type { OrderCardProps } from './OrderCard.types';

const DELIVERY_PHONE = process.env.NEXT_PUBLIC_DELIVERY_PHONE ?? '';

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
    ' · ' + d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export function OrderCard({ order, status, statuses, restaurantId, onOpen, onAdvance, onEdit }: OrderCardProps) {
  const isDomicilio = order.deliveryType === 'domicilio';
  const deliveryFee = order.deliveryFee ?? 0;
  const grandTotal = order.total + deliveryFee;
  const isTransfer = order.paymentMethod === 'Transferencia';

  // — delivery fee inline edit —
  const [editingFee, setEditingFee] = useState(false);
  const [feeInput, setFeeInput] = useState('');
  const [savingFee, setSavingFee] = useState(false);

  // — isPaid toggle —
  const [localIsPaid, setLocalIsPaid] = useState(order.isPaid ?? false);
  const [togglingPaid, setTogglingPaid] = useState(false);

  // — nota interna —
  const [editingNote, setEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState(order.internalNote ?? '');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (!togglingPaid) setLocalIsPaid(order.isPaid ?? false);
  }, [order.isPaid, togglingPaid]);

  useEffect(() => {
    if (!editingNote) setNoteInput(order.internalNote ?? '');
  }, [order.internalNote, editingNote]);

  const activeStatuses = statuses.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const currentIndex = activeStatuses.findIndex((s) => s.id === order.statusId);
  const nextStatus = currentIndex !== -1 && currentIndex < activeStatuses.length - 1
    ? activeStatuses[currentIndex + 1] : null;

  async function handleSaveFee() {
    const value = parseInt(feeInput.replace(/\D/g, ''), 10);
    if (isNaN(value) || value < 0) return;
    setSavingFee(true);
    try {
      await ordersService.updateDeliveryFee(restaurantId, order.id, value);
      setEditingFee(false);
      setFeeInput('');
    } finally {
      setSavingFee(false);
    }
  }

  async function handleTogglePaid() {
    if (togglingPaid) return;
    const next = !localIsPaid;
    setLocalIsPaid(next);
    setTogglingPaid(true);
    try {
      await ordersService.updateIsPaid(restaurantId, order.id, next);
    } catch {
      setLocalIsPaid(!next);
    } finally {
      setTogglingPaid(false);
    }
  }

  async function handleSaveNote() {
    setSavingNote(true);
    try {
      await ordersService.updateInternalNote(restaurantId, order.id, noteInput.trim());
      setEditingNote(false);
    } finally {
      setSavingNote(false);
    }
  }

  function buildDomiciliarioMsg() {
    const payLine = isTransfer
      ? localIsPaid
        ? '\n*Pago:* Transferencia ✅'
        : `\n*Pago:* Transferencia\n*Cobrar:* $${grandTotal.toLocaleString('es-CO')}`
      : `\n*Cobrar:* $${grandTotal.toLocaleString('es-CO')}`;
    const address = [order.customerAddress, order.barrio].filter(Boolean).join(' — ');
    const noteStr = noteInput ? `\n\n📝 *Nota:* ${noteInput}` : '';
    return encodeURIComponent(
      `🛵 *PEDIDO ${order.orderNumber}*\n\n` +
      `*Nombre:* ${order.customerName}\n` +
      `*Dirección:* ${address}\n` +
      `*Celular:* ${order.customerPhone}` +
      payLine + noteStr
    );
  }

  return (
    <div
      onClick={() => onOpen(order)}
      className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Header: número + estado + editar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-sm font-bold text-gray-900">{order.orderNumber}</span>
        <div className="flex items-center gap-2">
          {status && (
            <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: status.color }}>
              {status.name}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(order); }}
            className="p-1 rounded-lg text-gray-300 hover:text-[#FF6A1A] hover:bg-orange-50 transition-colors"
            aria-label="Editar pedido"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tiempo */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
        <Clock className="h-3 w-3" />
        <span>{timeAgo(order.createdAt)}</span>
        <span>·</span>
        <span>{formatShortDate(order.createdAt)}</span>
      </div>

      {/* Items */}
      <div className="space-y-1 mb-3">
        {order.items.slice(0, 3).map((item, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-gray-800">{item.productName} <span className="text-gray-500">×{item.quantity}</span></span>
              <span className="text-gray-700 font-medium ml-2 flex-shrink-0">{formatCurrency(item.subtotal)}</span>
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
        {order.items.length > 3 && <p className="text-xs text-gray-400">+{order.items.length - 3} más...</p>}
      </div>

      {/* Totales */}
      <div className="space-y-1 border-t border-gray-100 pt-2 mb-3 text-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between text-gray-600">
          <span>Total productos</span>
          <span className="font-medium">{formatCurrency(order.total)}</span>
        </div>

        {/* Valor domicilio editable */}
        {isDomicilio && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Bike className="h-3.5 w-3.5" />
              <span>Domicilio</span>
            </div>
            {editingFee ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">$</span>
                <input
                  type="number"
                  value={feeInput}
                  onChange={(e) => setFeeInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveFee(); if (e.key === 'Escape') { setEditingFee(false); setFeeInput(''); } }}
                  placeholder="0"
                  autoFocus
                  className="w-20 text-right text-sm font-bold border-b-2 border-[#FF6A1A] bg-transparent outline-none tabular-nums text-gray-900 placeholder-gray-300"
                />
                <button onClick={handleSaveFee} disabled={savingFee} className="text-xs font-bold text-white bg-[#FF6A1A] px-2 py-0.5 rounded-lg disabled:opacity-50">OK</button>
                <button onClick={() => { setEditingFee(false); setFeeInput(''); }} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setEditingFee(true); setFeeInput(deliveryFee > 0 ? String(deliveryFee) : ''); }}
                className={`flex items-center gap-1 text-sm font-bold tabular-nums transition-colors ${deliveryFee > 0 ? 'text-gray-500 hover:text-[#FF6A1A]' : 'text-[#FF6A1A]'}`}
              >
                {deliveryFee > 0 ? formatCurrency(deliveryFee) : '+ Agregar valor'}
                <Pencil className="h-3 w-3 opacity-60" />
              </button>
            )}
          </div>
        )}

        <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-dashed border-gray-200">
          <span>Total</span>
          <span className="text-[#FF6A1A]">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Cliente */}
      <div className="space-y-1.5 border-t border-gray-100 pt-2 text-sm" onClick={(e) => e.stopPropagation()}>
        <p className="font-semibold text-gray-900">{order.customerName}</p>

        {/* Método de pago + toggle isPaid */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            {order.paymentMethod === 'Transferencia' ? '🏧 Transferencia' : '💵 Efectivo'}
          </p>
          {isTransfer && (
            <button onClick={handleTogglePaid} disabled={togglingPaid} className="flex items-center gap-1.5 disabled:opacity-60">
              <span className="text-[10px] font-bold" style={{ color: localIsPaid ? '#059669' : '#FF6A1A' }}>
                {localIsPaid ? 'Pagado' : 'Pendiente'}
              </span>
              <div className="relative w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0" style={{ background: localIsPaid ? '#059669' : '#e5e5e5' }}>
                <div className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all duration-200" style={{ left: localIsPaid ? '17px' : '2px' }} />
              </div>
            </button>
          )}
        </div>

        {order.customerAddress && (
          <p className="flex items-start gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>{order.customerAddress}{order.barrio ? ` — ${order.barrio}` : ''}</span>
          </p>
        )}
        {order.location && (
          <a
            href={`https://maps.google.com/?q=${order.location.lat},${order.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Ver ubicación en mapa
          </a>
        )}
      </div>

      {/* Nota interna */}
      <div className="mt-2 border-t border-gray-100 pt-2" onClick={(e) => e.stopPropagation()}>
        {editingNote ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setEditingNote(false); setNoteInput(order.internalNote ?? ''); } }}
              placeholder="Nota interna..."
              autoFocus
              rows={2}
              className="w-full text-xs text-gray-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 outline-none resize-none placeholder-amber-300 focus:border-amber-400 transition-colors leading-relaxed"
            />
            <div className="flex items-center gap-1.5 justify-end">
              <button onClick={() => { setEditingNote(false); setNoteInput(order.internalNote ?? ''); }} className="text-xs text-gray-400 hover:text-gray-600 font-bold px-2 py-1">
                Cancelar
              </button>
              <button onClick={handleSaveNote} disabled={savingNote} className="flex items-center gap-1 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors">
                <Check className="h-3 w-3" />
                Guardar
              </button>
            </div>
          </div>
        ) : noteInput ? (
          <button onClick={() => setEditingNote(true)} className="w-full flex items-start gap-2 text-left group">
            <StickyNote className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-amber-700 leading-snug line-clamp-2 group-hover:text-amber-900 transition-colors">{noteInput}</span>
          </button>
        ) : (
          <button onClick={() => setEditingNote(true)} className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-amber-400 transition-colors font-medium">
            <StickyNote className="h-3 w-3" />
            Nota interna
          </button>
        )}
      </div>

      {/* Avanzar estado */}
      {nextStatus && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdvance(order.id, nextStatus.id); }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: nextStatus.color }}
        >
          <ArrowRight className="h-4 w-4" />
          {nextStatus.name}
        </button>
      )}

      {/* WhatsApp cliente */}
      <a
        href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <MessageCircle className="h-4 w-4" />
        {order.customerPhone}
      </a>

      {/* WhatsApp domiciliario */}
      {isDomicilio && DELIVERY_PHONE && (
        <a
          href={`https://wa.me/${DELIVERY_PHONE.replace(/\D/g, '')}?text=${buildDomiciliarioMsg()}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
        >
          <Bike className="h-4 w-4" />
          Enviar a domiciliario
        </a>
      )}
    </div>
  );
}
