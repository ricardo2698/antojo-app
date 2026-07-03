import { Download } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

import type { OrdersTableProps } from './OrdersTable.types';

export function OrdersTable({ orders, statuses, onExport }: OrdersTableProps) {
  const statusMap = new Map(statuses.map((s) => [s.id, s]));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Detalle de pedidos ({orders.length})
        </h3>
        {orders.length > 0 && (
          <Button variant="secondary" size="sm" onClick={onExport}>
            <Download className="h-3.5 w-3.5" />
            Exportar Excel
          </Button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
          <p className="text-sm text-gray-400">Sin pedidos en el rango seleccionado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Fecha', 'Pedido', 'Cliente', 'Estado', 'Método', 'Items', 'Total'].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {orders.map((order) => {
                const status = statusMap.get(order.statusId);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      {status && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: status.color }}
                        >
                          {status.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.paymentMethod}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{order.items.length}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <td colSpan={6} className="px-4 py-3 text-right text-sm font-bold text-gray-700">
                  Total
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                  {formatCurrency(orders.reduce((acc, o) => acc + o.total, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
