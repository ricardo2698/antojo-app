'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag, Wifi, RefreshCw, Plus, X, GripVertical } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useDraggable,
  useSensors,
  useSensor,
  pointerWithin,
} from '@dnd-kit/core';

import { useAuth } from '@/features/auth';
import { useOrderStatuses } from '@/features/order-statuses/hooks/useOrderStatuses';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useAdicionales } from '@/features/adicionales/hooks/useAdicionales';
import { useCategories } from '@/features/categories';
import type { Order, OrderStatus } from '@/types';

import { useOrders } from '../../hooks/useOrders';
import { useUpdateOrderStatus } from '../../hooks/useUpdateOrderStatus';
import { OrderCard } from '../OrderCard';
import { OrderDetailModal } from '../OrderDetailModal';
import { ManualOrderModal } from '../ManualOrderModal';
import { EditOrderModal } from '../EditOrderModal';

type DateFilter = 'today' | 'month' | 'all';

// ── Toast ────────────────────────────────────────────────────────────────────

interface ToastItem { id: number; orderNumber: string; }

function NewOrderToast({ toast, onClose }: { toast: ToastItem; onClose: (id: number) => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onClose(toast.id), 400);
    }, 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast.id, onClose]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onClose(toast.id), 400);
  };

  return (
    <div
      className="pointer-events-auto w-full max-w-sm transition-all duration-400"
      style={{
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? 'translateX(0)' : 'translateX(110%)',
        transitionDuration: '400ms',
      }}
    >
      <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
        <div className="h-1 bg-white/20 overflow-hidden">
          <div className="h-full bg-white/60" style={{ animation: 'toast-progress 5.5s linear forwards' }} />
        </div>
        <div className="px-4 py-3 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 text-xl">🔔</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">¡Nuevo pedido!</p>
            <p className="text-white/80 text-xs mt-0.5">{toast.orderNumber}</p>
          </div>
          <button onClick={handleClose} className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <X className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </div>
      <style>{`@keyframes toast-progress { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}

function ToastContainer({ toasts, onClose }: { toasts: ToastItem[]; onClose: (id: number) => void }) {
  if (toasts.length === 0 || typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 360, width: 'calc(100vw - 2rem)' }}>
      {toasts.map((t) => <NewOrderToast key={t.id} toast={t} onClose={onClose} />)}
    </div>,
    document.body
  );
}

// ── Droppable column ─────────────────────────────────────────────────────────

function DroppableColumn({
  statusId, children, color,
}: {
  statusId: string;
  children: React.ReactNode;
  color: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: statusId });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-24 rounded-2xl p-2 space-y-3 transition-all duration-150 ${isOver ? 'ring-2 ring-offset-2' : ''}`}
      style={{
        backgroundColor: `${color}18`,
        ...(isOver ? { ringColor: color } : {}),
        outline: isOver ? `2px solid ${color}` : 'none',
        outlineOffset: isOver ? 2 : 0,
      }}
    >
      {children}
    </div>
  );
}

// ── Draggable card ────────────────────────────────────────────────────────────

function DraggableCard(props: React.ComponentProps<typeof OrderCard>) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: props.order.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.35 : 1, cursor: isDragging ? 'grabbing' : 'grab' }}
      className="relative group"
    >
      <div className="absolute top-3 right-10 z-10 p-1 rounded-lg text-gray-300 group-hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <GripVertical className="h-4 w-4" />
      </div>
      <OrderCard {...props} />
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isToday(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function isThisMonth(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

// ── Main component ────────────────────────────────────────────────────────────

export function OrdersManager() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId ?? '';

  const [refreshKey, setRefreshKey] = useState(0);
  const { orders, isLoading } = useOrders(restaurantId, refreshKey);
  const { data: statuses = [] } = useOrderStatuses(restaurantId);
  const { data: products = [] } = useProducts(restaurantId);
  const { data: adicionales = [] } = useAdicionales(restaurantId);
  const { data: categories = [] } = useCategories(restaurantId);
  const { updateStatus } = useUpdateOrderStatus(restaurantId);

  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dragError, setDragError] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const knownIdsRef = useRef<Set<string> | null>(null);
  const toastCounterRef = useRef(0);

  // Scroll sync refs
  const boardScrollRef = useRef<HTMLDivElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const [boardScrollWidth, setBoardScrollWidth] = useState(0);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const receivedStatusId = statuses.find((s) => s.code === 'received')?.id ?? '';

  const activeStatuses = statuses.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  // Update scroll width when content changes
  useEffect(() => {
    const update = () => {
      if (boardScrollRef.current) setBoardScrollWidth(boardScrollRef.current.scrollWidth);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [orders, dateFilter, activeStatuses.length]);

  // Sync top scrollbar ↔ board scroll
  useEffect(() => {
    const board = boardScrollRef.current;
    const top = topScrollRef.current;
    if (!board || !top) return;
    const onBoard = () => { top.scrollLeft = board.scrollLeft; };
    const onTop = () => { board.scrollLeft = top.scrollLeft; };
    board.addEventListener('scroll', onBoard);
    top.addEventListener('scroll', onTop);
    return () => {
      board.removeEventListener('scroll', onBoard);
      top.removeEventListener('scroll', onTop);
    };
  }, []);

  // Detect new orders
  useEffect(() => {
    if (isLoading) return;
    const currentIds = new Set(orders.map((o) => o.id));

    if (knownIdsRef.current === null) {
      knownIdsRef.current = currentIds;
      return;
    }

    const newOrders = orders.filter((o) => !knownIdsRef.current!.has(o.id));
    newOrders.forEach((o) => {
      const id = ++toastCounterRef.current;
      setToasts((prev) => [...prev, { id, orderNumber: o.orderNumber }]);
    });
    knownIdsRef.current = currentIds;
  }, [orders, isLoading]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (dateFilter === 'today') return isToday(o.createdAt);
    if (dateFilter === 'month') return isThisMonth(o.createdAt);
    return true;
  });

  const ordersByStatus = (statusId: string) => filteredOrders.filter((o) => o.statusId === statusId);

  async function handleAdvance(orderId: string, nextStatusId: string) {
    await updateStatus(orderId, nextStatusId);
  }

  // Drag handlers
  function handleDragStart(event: DragStartEvent) {
    setActiveOrderId(String(event.active.id));
    setDragError(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveOrderId(null);
    const { active, over } = event;
    if (!over) return;

    const order = filteredOrders.find((o) => o.id === String(active.id));
    if (!order) return;

    const newStatusId = String(over.id);
    if (order.statusId === newStatusId) return;

    try {
      await updateStatus(order.id, newStatusId);
    } catch {
      setDragError('No se pudo mover el pedido. Intentá de nuevo.');
      setTimeout(() => setDragError(null), 3000);
    }
  }

  const activeOrder = activeOrderId ? filteredOrders.find((o) => o.id === activeOrderId) : null;
  const activeOrderStatus = activeOrder
    ? activeStatuses.find((s) => s.id === activeOrder.statusId)
    : undefined;

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

        <div className="flex gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Pedido manual
          </button>
          <button
            onClick={() => {
              knownIdsRef.current = null;
              setRefreshKey((k) => k + 1);
            }}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refrescar
          </button>
        </div>
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

      {/* Error de drag */}
      {dragError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {dragError}
        </div>
      )}

      {/* Kanban con DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Scrollbar superior sincronizado */}
        <div
          ref={topScrollRef}
          className="overflow-x-scroll overflow-y-hidden -mx-6 px-6"
          style={{ height: 12 }}
        >
          <div style={{ width: boardScrollWidth, height: 1 }} />
        </div>

        {/* Board */}
        <div
          ref={boardScrollRef}
          className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6"
          style={{ scrollbarWidth: 'none' }}
        >
          <style>{`#board-scroll::-webkit-scrollbar { display: none; }`}</style>

          {activeStatuses.map((status) => {
            const columnOrders = ordersByStatus(status.id);
            return (
              <div key={status.id} className="w-72 flex-shrink-0">
                {/* Column header */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="font-semibold text-gray-800">{status.name}</span>
                  {columnOrders.length > 0 && (
                    <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-600">
                      {columnOrders.length}
                    </span>
                  )}
                </div>

                {/* Column body — droppable */}
                <DroppableColumn statusId={status.id} color={status.color}>
                  {columnOrders.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-sm text-gray-400">
                      <div className="text-center">
                        <ShoppingBag className="mx-auto mb-2 h-6 w-6 opacity-30" />
                        <span>Sin pedidos</span>
                      </div>
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <DraggableCard
                        key={order.id}
                        order={order}
                        status={status}
                        statuses={activeStatuses}
                        restaurantId={restaurantId}
                        onOpen={setSelectedOrder}
                        onAdvance={handleAdvance}
                        onEdit={setEditingOrder}
                      />
                    ))
                  )}
                </DroppableColumn>
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

        {/* Ghost card mientras se arrastra */}
        <DragOverlay dropAnimation={null}>
          {activeOrder ? (
            <div className="rotate-1 scale-105 shadow-2xl rounded-2xl opacity-95 pointer-events-none">
              <OrderCard
                order={activeOrder}
                status={activeOrderStatus}
                statuses={activeStatuses}
                restaurantId={restaurantId}
                onOpen={() => {}}
                onAdvance={() => {}}
                onEdit={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modal de detalle */}
      <OrderDetailModal
        order={selectedOrder}
        statuses={statuses}
        restaurantId={restaurantId}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* Modal editar pedido */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          restaurantId={restaurantId}
          products={products}
          adicionales={adicionales}
          categories={categories}
          onClose={() => setEditingOrder(null)}
          onSaved={() => setEditingOrder(null)}
        />
      )}

      {/* Modal pedido manual */}
      <ManualOrderModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        restaurantId={restaurantId}
        receivedStatusId={receivedStatusId}
        products={products}
        adicionales={adicionales}
        categories={categories}
      />

      {/* Toasts nuevos pedidos */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
