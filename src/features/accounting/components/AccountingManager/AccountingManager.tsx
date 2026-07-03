'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { useOrderStatuses } from '@/features/order-statuses/hooks/useOrderStatuses';
import { cn } from '@/lib/utils';

import { calculateStats, exportToExcel, getPresetRange } from '../../helpers/accounting.helpers';
import { useAccountingOrders } from '../../hooks/useAccountingOrders';
import type { DatePreset, DateRange } from '../../types/accounting.types';
import { AccountingSummary } from '../AccountingSummary';
import { OrdersTable } from '../OrdersTable';

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Esta semana' },
  { key: 'month', label: 'Este mes' },
  { key: 'custom', label: 'Personalizado' },
];

function toInputDate(iso: string) {
  return iso.slice(0, 10);
}

function fromInputDate(dateStr: string, isEnd: boolean): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = isEnd
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
  return d.toISOString();
}

export function AccountingManager() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId ?? '';

  const { data: statuses = [] } = useOrderStatuses(restaurantId);

  const [preset, setPreset] = useState<DatePreset>('month');
  const [customRange, setCustomRange] = useState<DateRange>(() => getPresetRange('month'));

  const activeRange: DateRange =
    preset === 'custom' ? customRange : getPresetRange(preset as 'today' | 'week' | 'month');

  const { data: orders = [], isLoading } = useAccountingOrders(restaurantId, activeRange);

  const stats = calculateStats(orders);

  function handlePreset(key: DatePreset) {
    setPreset(key);
    if (key !== 'custom') {
      setCustomRange(getPresetRange(key as 'today' | 'week' | 'month'));
    }
  }

  if (!restaurantId) {
    return <p className="text-sm text-red-600">Tu cuenta no tiene un restaurante asignado.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contabilidad</h2>
        <p className="mt-0.5 text-sm text-gray-500">Resumen financiero de tu restaurante</p>
      </div>

      {/* Filtros de fecha */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
          {PRESETS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                preset === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {preset === 'custom' && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={toInputDate(customRange.start)}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, start: fromInputDate(e.target.value, false) }))
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <span className="text-gray-400">—</span>
            <input
              type="date"
              value={toInputDate(customRange.end)}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, end: fromInputDate(e.target.value, true) }))
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        )}
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          <AccountingSummary stats={stats} />
          <OrdersTable
            orders={orders}
            statuses={statuses}
            onExport={() => exportToExcel(orders)}
          />
        </div>
      )}
    </div>
  );
}
