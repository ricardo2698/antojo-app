# Componentes — Convenciones

## Reglas absolutas

- **Máximo 300 líneas** por archivo de componente (JSX + lógica local).
- Si supera ese límite → extrae subcomponentes o lógica a un hook.
- **Un componente = una responsabilidad**.
- **Cero lógica de negocio en el JSX** — solo llamadas a hooks y renderizado.
- **Props siempre tipadas** en archivo `.types.ts` separado.
- **Cada componente vive en su propia carpeta** — si una carpeta `components/` tiene más de un componente suelto, se reorganiza sin excepción. Nunca archivos `.tsx` flotando junto a otros en el mismo nivel.

---

## Anatomía de un componente

```tsx
// OrderCard.tsx
import type { OrderCardProps } from './OrderCard.types';
import { useOrderCard } from '@/features/orders/hooks/useOrderCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ORDER_STATUS_LABEL } from '@/constants/config';

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const { handleStatusChange, isUpdating } = useOrderCard({ order, onStatusChange });

  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">#{order.id}</span>
        <Badge variant={order.status}>{ORDER_STATUS_LABEL[order.status]}</Badge>
      </header>

      <p className="mt-2 font-semibold">{order.customerName}</p>
      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>

      <footer className="mt-4 flex items-center justify-between">
        <span className="font-bold">{formatCurrency(order.total)}</span>
        <button
          onClick={handleStatusChange}
          disabled={isUpdating}
          className="rounded-lg bg-primary px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          {isUpdating ? 'Guardando...' : 'Actualizar estado'}
        </button>
      </footer>
    </article>
  );
}
```

---

## Organización obligatoria en carpetas individuales

Todo componente no trivial **debe** vivir en su propia carpeta. Si una carpeta acumula más de un archivo `.tsx` suelto al mismo nivel, se reorganiza de inmediato.

### ❌ Prohibido — archivos sueltos en el mismo nivel

```
features/orders/components/
├── OrderCard.tsx          ← suelto
├── OrderCard.types.ts     ← suelto
├── OrderList.tsx          ← suelto
├── OrderList.types.ts     ← suelto
└── OrderStatusBadge.tsx   ← suelto
```

### ✅ Correcto — cada componente en su carpeta

```
features/orders/components/
├── OrderCard/
│   ├── OrderCard.tsx
│   ├── OrderCard.types.ts
│   └── index.ts
├── OrderList/
│   ├── OrderList.tsx
│   ├── OrderList.types.ts
│   └── index.ts
└── OrderStatusBadge/
    ├── OrderStatusBadge.tsx
    ├── OrderStatusBadge.types.ts
    └── index.ts
```

### Regla de reorganización

> Si en cualquier carpeta `components/` aparece más de **un archivo `.tsx`** en el mismo nivel → reorganiza todos en subcarpetas individuales antes de continuar. No es negociable.

### Componentes internos (no exportados)

Si un componente es exclusivo de otro y no tiene sentido exportarlo, vive **dentro de la carpeta del padre**:

```
OrderTable/
├── OrderTable.tsx
├── OrderTable.types.ts
├── OrderTableRow.tsx       ← subcomponente interno, no se exporta desde index
├── OrderTableHeader.tsx    ← subcomponente interno
└── index.ts                ← solo exporta OrderTable y sus tipos públicos
```

El `index.ts` solo expone lo que es público:
```ts
// OrderTable/index.ts
export { OrderTable } from './OrderTable';
export type { OrderTableProps } from './OrderTable.types';
// OrderTableRow y OrderTableHeader NO se exportan
```

---

## Tipos en archivo separado

```ts
// OrderCard.types.ts
import type { Order } from '@/features/orders/types/order.types';

export interface OrderCardProps {
  order: Order;
  onStatusChange?: (orderId: string, newStatus: Order['status']) => void;
}
```

---

## Server Components vs Client Components

### Server Component (default en App Router)
```tsx
// Sin 'use client' → es Server Component
// ✅ Puede hacer fetch directo, acceder a DB, leer env vars de servidor
// ❌ No puede usar useState, useEffect, event handlers

import { getOrders } from '@/features/orders/services/orders.service';
import { OrderList } from '@/features/orders/components/OrderList';

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrderList orders={orders} />;
}
```

### Client Component
```tsx
'use client';
// ✅ Interactividad, hooks, event handlers
// ❌ No puede ser async, no accede a servidor directamente

import { useState } from 'react';
import type { OrderFiltersProps } from './OrderFilters.types';

export function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [status, setStatus] = useState<string>('all');
  // ...
}
```

### Regla de decisión

```
¿Necesita interactividad? (onClick, onChange, useState, useEffect)
  → Client Component

¿Solo muestra datos que vienen de props o del servidor?
  → Server Component (preferido)

¿Necesita ambos?
  → Server Component padre + Client Component hijo
```

---

## Patrones prohibidos

```tsx
// ❌ Lógica de negocio en JSX
<button onClick={() => {
  const data = await fetch('/api/orders');
  setOrders(data.json());
}}>

// ❌ Prop drilling excesivo (más de 2 niveles)
<Page order={order}>
  <Section order={order}>
    <Card order={order}>  // ← usar Context o Zustand

// ❌ Componente que hace todo
export function OrderDashboard() {
  // 400 líneas con fetch, filtros, tabla, modal... → dividir

// ❌ Estilos inline complejos
<div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
// → usar clases Tailwind
```

---

## Composición de componentes complejos

Para dashboards o vistas complejas, usa composición:

```tsx
// orders/page.tsx — solo orquesta
export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <DashboardLayout>
      <PageHeader title="Pedidos" />
      <OrderFiltersBar />
      <OrderStatsRow orders={orders} />
      <OrderTable orders={orders} />
    </DashboardLayout>
  );
}
```

Cada sección es su propio componente con su propia responsabilidad.
