import { ShoppingBag, TrendingUp, DollarSign, CreditCard } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';

import type { AccountingSummaryProps } from './AccountingSummary.types';

export function AccountingSummary({ stats }: AccountingSummaryProps) {
  const { totalRevenue, orderCount, avgTicket, byPaymentMethod } = stats;

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total facturado"
          value={formatCurrency(totalRevenue)}
          color="orange"
        />
        <StatCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Pedidos"
          value={String(orderCount)}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Ticket promedio"
          value={formatCurrency(avgTicket)}
          color="green"
        />
      </div>

      {/* Desglose por método de pago */}
      {Object.keys(byPaymentMethod).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700">Por método de pago</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(byPaymentMethod)
              .sort(([, a], [, b]) => b - a)
              .map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-3">
                    <span className="text-sm text-gray-600">{method}</span>
                    <div className="flex-1 rounded-full bg-gray-100 h-1.5 max-w-32">
                      <div
                        className="h-1.5 rounded-full bg-orange-400"
                        style={{
                          width: `${totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'orange' | 'blue' | 'green';
}

const colorMap = {
  orange: 'bg-orange-50 text-orange-600',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
};

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className={`mb-3 inline-flex rounded-lg p-2 ${colorMap[color]}`}>{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-0.5 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
